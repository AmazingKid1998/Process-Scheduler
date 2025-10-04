// src/algorithms/fcfs.js
export function fcfs(processes) {
  const procs = [...processes].sort((a, b) => a.arrival - b.arrival);
  const slices = [];
  const firstResponse = {};
  let t = 0;
  for (const p of procs) {
    if (t < p.arrival) t = p.arrival;
    const start = t;
    const end = t + p.burst;
    slices.push({ pid: p.id, start, end });
    if (firstResponse[p.id] === undefined) firstResponse[p.id] = start;
    t = end;
  }
  return { slices, firstResponse };
}
