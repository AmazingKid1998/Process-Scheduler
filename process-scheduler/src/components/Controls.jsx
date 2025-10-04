import React from 'react';

export default function Controls({ algorithm, quantum, setAlgorithm, setQuantum, onRun }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
      <label>
        Algorithm:{' '}
        <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
          <option>FCFS</option>
          <option>RR</option>
          <option>SJF</option>
          <option>SRTF</option>
        </select>
      </label>
      {algorithm === 'RR' && (
        <label>
          Quantum:{' '}
          <input type="number" min="1" step="1" value={quantum} onChange={e => setQuantum(+e.target.value)} />
        </label>
      )}
      <button onClick={onRun}>Run</button>
    </div>
  );
}
