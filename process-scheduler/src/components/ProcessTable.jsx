// src/components/ProcessTable.js
import React from 'react';

export default function ProcessTable({ processes, setProcesses }) {
  const update = (idx, key, val) => {
    const next = processes.slice();
    next[idx] = { ...next[idx], [key]: key === 'name' ? val : +val };
    setProcesses(next);
  };
  const add = () => setProcesses([...processes, { id: `P${processes.length + 1}`, name:'P'+(processes.length+1), arrival:0, burst:1 }]);
  const del = (idx) => setProcesses(processes.filter((_, i) => i !== idx));

  return (
    <div style={{ marginBottom: 8 }}>
      <table>
        <thead>
          <tr><th>PID</th><th>Name</th><th>Arrival</th><th>Burst</th><th></th></tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><input value={p.name} onChange={e=>update(i,'name',e.target.value)} /></td>
              <td><input type="number" value={p.arrival} onChange={e=>update(i,'arrival',e.target.value)} /></td>
              <td><input type="number" value={p.burst} onChange={e=>update(i,'burst',e.target.value)} /></td>
              <td><button onClick={()=>del(i)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add}>Add process</button>
    </div>
  );
}
