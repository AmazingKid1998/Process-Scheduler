import React, { useEffect, useReducer } from 'react';

import MetricsPanel from './components/MetricsPanel.jsx';
import Gantt from './components/Gantt.jsx';
import Controls from './components/Controls.jsx';
import ProcessTable from './components/ProcessTable.jsx';
import ImportExport from './components/ImportExport.jsx';
import { runSchedule } from './sim/engine';
import { reducer, initialState } from './store/reducer';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem('scheduler_state');
    return saved ? JSON.parse(saved) : init;
  });

  useEffect(() => {
    localStorage.setItem('scheduler_state', JSON.stringify(state));
  }, [state]);

  const setProcesses = (p) => dispatch({ type: 'setProcesses', payload: p });
  const onRun = () => {
    const result = runSchedule(state.processes, { algorithm: state.algorithm, quantum: state.quantum });
    dispatch({ type: 'setResult', payload: result });
  };

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Process Scheduler (JS)</h2>

      <ImportExport processes={state.processes} setProcesses={setProcesses} />

      <ProcessTable processes={state.processes} setProcesses={setProcesses} />
      <Controls
        algorithm={state.algorithm}
        quantum={state.quantum}
        setAlgorithm={(a)=>dispatch({type:'setAlgorithm', payload:a})}
        setQuantum={(q)=>dispatch({type:'setQuantum', payload:q})}
        onRun={onRun}
      />
      {state.result && <>
        <Gantt slices={state.result.slices} processes={state.processes} />
        <MetricsPanel metrics={state.result.metrics} />
      </>}
    </div>
  );
}
