// src/components/MetricsPanel.js
import React from 'react';

export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;
  const { avgWaiting, avgTurnaround, avgResponse, cpuUtilization, throughput, perProcess } = metrics;

  return (
    <div style={{ marginTop: 8 }}>
      <b>Averages</b>
      <div>Avg Waiting: {avgWaiting.toFixed(2)}</div>
      <div>Avg Turnaround: {avgTurnaround.toFixed(2)}</div>
      <div>Avg Response: {avgResponse.toFixed(2)}</div>
      <div>CPU Utilization: {cpuUtilization.toFixed(1)}%</div>
      <div>Throughput: {throughput.toFixed(3)} / unit</div>
      <details>
        <summary>Per-process</summary>
        <ul>
          {Object.entries(perProcess).map(([pid, m]) => (
            <li key={pid}>{pid}: W={m.waiting}, T={m.turnaround}, R={m.response}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
