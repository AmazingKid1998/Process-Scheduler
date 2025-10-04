import { fcfs } from '../algorithms/fcfs';
import { roundRobin } from '../algorithms/rr';
import { sjf, srtf } from '../algorithms/sjf';
import { computeMetrics } from '../algorithms/metrics';

export function runSchedule(processes, config) {
  const { algorithm, quantum } = config;

  if (algorithm === 'FCFS') {
    const { slices, firstResponse } = fcfs(processes);
    const metrics = computeMetrics(processes, slices, firstResponse);
    return { slices, metrics };
  }

  if (algorithm === 'RR') {
    const { slices, firstResponse } = roundRobin(processes, quantum || 2);
    const metrics = computeMetrics(processes, slices, firstResponse);
    return { slices, metrics };
  }

  if (algorithm === 'SJF') {
    const { slices, firstResponse } = sjf(processes);
    const metrics = computeMetrics(processes, slices, firstResponse);
    return { slices, metrics };
  }

  if (algorithm === 'SRTF') {
    const { slices, firstResponse } = srtf(processes);
    const metrics = computeMetrics(processes, slices, firstResponse);
    return { slices, metrics };
  }

  throw new Error('Unsupported algorithm');
}
