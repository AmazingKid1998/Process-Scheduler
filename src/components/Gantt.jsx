import React from 'react';

/**
 * Return only the part of each slice that occurs at/before time t.
 * This makes the chart "grow" as the simulation runs.
 */
function cropSlicesUpTo(slices, t) {
  if (t == null || !Number.isFinite(t)) return slices;
  const out = [];
  for (const s of slices) {
    if (s.start >= t) break;              // entirely in the future
    const end = Math.min(s.end, t);       // cut at t
    if (end > s.start) out.push({ pid: s.pid, start: s.start, end });
  }
  return out;
}

export default function Gantt({
  slices,
  processes,
  pxPerUnit = 20,
  height = 60,
  currentTime = null, // pass the playhead 't' here
  showFutureFaded = true, // optional visual tweak
}) {
  const colors = {};
  processes.forEach((p, idx) => {
    colors[p.id] = `hsl(${(idx * 67) % 360} 70% 55%)`;
  });

  const maxT = Math.max(0, ...slices.map(s => s.end));
  const pastSlices = cropSlicesUpTo(slices, currentTime ?? maxT);

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #ddd', padding: 8 }}>
      <svg width={maxT * pxPerUnit + 40} height={height + 30}>
        {/* time grid */}
        {Array.from({ length: maxT + 1 }).map((_, t) => (
          <g key={t} transform={`translate(${t * pxPerUnit},0)`}>
            <line x1="0" y1="0" x2="0" y2={height} stroke="#eee" />
            <text x="2" y={height + 12} fontSize="10">{t}</text>
          </g>
        ))}

        {/* PAST (solid) */}
        {pastSlices.map((s, i) => {
          const x = s.start * pxPerUnit;
          const w = (s.end - s.start) * pxPerUnit;
          return (
            <g key={`past-${i}`}>
              <rect x={x} y={10} width={w} height={height - 20} fill={colors[s.pid]} rx="4" />
              <text x={x + 4} y={height / 2 + 3} fontSize="12">{s.pid}</text>
            </g>
          );
        })}

        {/* FUTURE (faded), purely cosmetic */}
        {showFutureFaded && Number.isFinite(currentTime) && currentTime !== null && slices.map((s, i) => {
          const startPx = s.start * pxPerUnit;
          const endPx = s.end * pxPerUnit;
          const curPx = Math.min((currentTime ?? 0) * pxPerUnit, endPx);
          const pastW = Math.max(0, curPx - startPx);
          const futureW = Math.max(0, endPx - (startPx + pastW));
          if (futureW <= 0) return null;
          return (
            <g key={`future-${i}`}>
              <rect
                x={startPx + pastW}
                y={10}
                width={futureW}
                height={height - 20}
                fill={colors[s.pid]}
                opacity="0.25"
                rx="4"
              />
            </g>
          );
        })}

        {/* playhead cursor */}
        {Number.isFinite(currentTime) && currentTime !== null && (
          <g transform={`translate(${currentTime * pxPerUnit},0)`}>
            <line x1="0" y1="0" x2="0" y2={height} stroke="black" strokeDasharray="4 3" />
            <polygon points="-4,0 4,0 0,6" fill="black" />
          </g>
        )}
      </svg>
    </div>
  );
}
