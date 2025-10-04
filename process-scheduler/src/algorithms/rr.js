// src/algorithms/rr.js
/**
 * @param {Process[]} processes
 * @param {number} quantum
 * @returns {{ slices: Slice[], firstResponse: Record<string, number> }}
 */
export function roundRobin(processes, quantum) {
  const procs = processes
    .map(p => ({ ...p, remaining: p.burst }))
    .sort((a, b) => a.arrival - b.arrival);

  const ready = [];
  const slices = [];
  const firstResponse = {};
  let t = 0;
  let i = 0; // index for arrivals

  const enqueueArrivals = () => {
    while (i < procs.length && procs[i].arrival <= t) {
      ready.push(procs[i]);
      i++;
    }
  };

  // Start at first arrival if idle
  if (procs.length && procs[0].arrival > 0) t = procs[0].arrival;

  enqueueArrivals();

  while (ready.length || i < procs.length) {
    if (!ready.length) {
      // jump time to next arrival
      t = Math.max(t, procs[i].arrival);
      enqueueArrivals();
      continue;
    }

    const cur = ready.shift();
    const run = Math.min(quantum, cur.remaining);
    const start = t;
    const end = t + run;

    if (firstResponse[cur.id] === undefined) {
      firstResponse[cur.id] = start;
    }

    slices.push({ pid: cur.id, start, end });
    cur.remaining -= run;
    t = end;

    // add newly arrived during the run
    enqueueArrivals();

    if (cur.remaining > 0) {
      // preempted; goes to back
      ready.push(cur);
    }
  }
  return { slices, firstResponse };
}
