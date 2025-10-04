// src/components/Gantt.js
import React from 'react';

export default function Gantt({ slices, processes, pxPerUnit = 20, height = 60 }) {
  const colors = {};
  processes.forEach((p, idx) => (colors[p.id] = `hsl(${(idx * 67) % 360} 70% 55%)`));
  const maxT = slices.reduce((m, s) => Math.max(m, s.end), 0);

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #ddd', padding: 8 }}>
      <svg width={maxT * pxPerUnit + 40} height={height + 30}>
        {/* time axis */}
        {Array.from({ length: maxT + 1 }).map((_, t) => (
          <g key={t} transform={`translate(${t * pxPerUnit},0)`}>
            <line x1="0" y1="0" x2="0" y2={height} stroke="#ccc" />
            <text x="2" y={height + 12} fontSize="10">{t}</text>
          </g>
        ))}
        {/* slices */}
        {slices.map((s, i) => {
          const x = s.start * pxPerUnit;
          const w = (s.end - s.start) * pxPerUnit;
          return (
            <g key={i}>
              <rect x={x} y={10} width={w} height={height - 20} fill={colors[s.pid]} rx="4" />
              <text x={x + 4} y={height / 2 + 3} fontSize="12" fill="#000">{s.pid}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
