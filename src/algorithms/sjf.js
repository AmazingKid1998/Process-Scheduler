// Non-preemptive SJF and preemptive SRTF (Shortest Remaining Time First)

/**
 * SJF (non-preemptive): pick the shortest burst among arrived jobs; run to completion
 * @param {Process[]} processes
 * @returns {{ slices: Slice[], firstResponse: Record<string, number> }}
 */
export function sjf(processes) {
  const procs = processes.map(p => ({ ...p })).sort((a, b) => a.arrival - b.arrival);
  const done = new Set();
  const slices = [];
  const firstResponse = {};
  let t = 0;

  const arrivedNotDone = () => procs.filter(p => p.arrival <= t && !done.has(p.id));

  if (procs.length && procs[0].arrival > 0) t = procs[0].arrival;

  while (done.size < procs.length) {
    let ready = arrivedNotDone();

    if (!ready.length) {
      // jump to next arrival
      const next = procs.find(p => !done.has(p.id) && p.arrival > t);
      t = next ? next.arrival : t;
      ready = arrivedNotDone();
      if (!ready.length) break;
    }

    // pick shortest burst
    ready.sort((a, b) => a.burst - b.burst);
    const cur = ready[0];

    const start = t;
    const end = t + cur.burst;

    if (firstResponse[cur.id] === undefined) firstResponse[cur.id] = start;

    slices.push({ pid: cur.id, start, end });
    t = end;
    done.add(cur.id);
  }

  return { slices, firstResponse };
}

/**
 * SRTF (preemptive SJF): always run the job with the least remaining time; preempt on arrivals
 * @param {Process[]} processes
 * @returns {{ slices: Slice[], firstResponse: Record<string, number> }}
 */
export function srtf(processes) {
  const procs = processes
    .map(p => ({ ...p, remaining: p.burst }))
    .sort((a, b) => a.arrival - b.arrival);

  const slices = [];
  const firstResponse = {};
  let t = 0;
  let i = 0; // arrivals index
  let current = null;

  const pick = () => {
    // among arrived with remaining > 0, pick smallest remaining
    let best = null;
    for (const p of procs) {
      if (p.arrival <= t && p.remaining > 0) {
        if (!best || p.remaining < best.remaining) best = p;
      }
    }
    return best;
  };

  // start at first arrival if idle
  if (procs.length && procs[0].arrival > 0) t = procs[0].arrival;

  // Process timeline by checking the next event: either a new arrival or current finishing/preemption boundary
  while (true) {
    // If everything finished, stop
    if (procs.every(p => p.remaining === 0)) break;

    // bring in arrivals up to time t (i is only used to fast-forward; we still use pick() for selection)
    while (i < procs.length && procs[i].arrival <= t) i++;

    const nextArrivalTime = i < procs.length ? procs[i].arrival : Infinity;

    const chosen = pick();
    if (!chosen) {
      // no job ready; jump to next arrival
      t = nextArrivalTime;
      continue;
    }

    if (chosen !== current) {
      // context switch: start a new slice
      current = chosen;
      if (firstResponse[current.id] === undefined) firstResponse[current.id] = t;
      slices.push({ pid: current.id, start: t, end: t }); // we'll extend 'end' as we run
    }

    // run until either a new arrival occurs (which may cause preemption) or the current finishes
    const timeToFinish = current.remaining;
    const timeToNextArrival = nextArrivalTime - t;

    const runFor = Math.min(timeToFinish, timeToNextArrival);
    const lastSlice = slices[slices.length - 1];
    lastSlice.end += runFor;

    current.remaining -= runFor;
    t += runFor;

    // If a new arrival just happened, loop will reconsider pick() and possibly preempt
    // If the current finished exactly here, current will change on next iteration
  }

  return { slices, firstResponse };
}
