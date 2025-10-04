import React, { useRef } from 'react';
import { exportCSV, importCSV } from '../lib/csv';

export default function ImportExport({ processes, setProcesses }) {
  const fileRef = useRef(null);

  const onExport = () => {
    const csv = exportCSV(processes);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onImportClick = () => fileRef.current?.click();

  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const list = importCSV(text);
        if (list.length) setProcesses(list);
        else alert('No valid rows found in CSV.');
      } catch (err) {
        alert('Failed to import CSV: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
      <button onClick={onExport}>Export CSV</button>
      <button onClick={onImportClick}>Import CSV</button>
      <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={onImportFile}/>
    </div>
  );
}
