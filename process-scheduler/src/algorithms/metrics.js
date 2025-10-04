// src/algorithms/metrics.js
/**
 * @param {Process[]} processes
 * @param {Slice[]} slices
 * @param {Record<string, number>} firstResponse
 */
export function computeMetrics(processes, slices, firstResponse = {}) {
  const byPid = processes.reduce((acc, p) => {
    acc[p.id] = { arrival: p.arrival, burst: p.burst, slices: [] };
    return acc;
  }, {});

  for (const s of slices) byPid[s.pid]?.slices.push(s);

  const per = {};
  let totalEnd = 0;

  for (const p of processes) {
    const rec = byPid[p.id];
    if (!rec || rec.slices.length === 0) continue;

    const finish = rec.slices[rec.slices.length - 1].end;
    totalEnd = Math.max(totalEnd, finish);

    const turnaround = finish - p.arrival;
    const waiting = turnaround - p.burst;
    const response = (firstResponse[p.id] ?? rec.slices[0].start) - p.arrival;

    per[p.id] = { waiting, turnaround, response };
  }

  const n = processes.length;
  const avgWaiting = avg(Object.values(per).map(x => x.waiting));
  const avgTurnaround = avg(Object.values(per).map(x => x.turnaround));
  const avgResponse = avg(Object.values(per).map(x => x.response));

  const totalBurst = processes.reduce((s, p) => s + p.burst, 0);
  const cpuUtilization = totalEnd ? (totalBurst / totalEnd) * 100 : 0;
  const throughput = totalEnd ? n / totalEnd : 0;

  return { perProcess: per, avgWaiting, avgTurnaround, avgResponse, cpuUtilization, throughput };
}

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
