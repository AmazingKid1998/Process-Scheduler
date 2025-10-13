import React, { useEffect, useReducer, useMemo } from 'react';
import ProcessTable from './components/ProcessTable.jsx';
import Controls from './components/Controls.jsx';
import Gantt from './components/Gantt.jsx';
import MetricsPanel from './components/MetricsPanel.jsx';
import ImportExport from './components/ImportExport.jsx';
import SimControls from './components/SimControls.jsx';
import usePlayback from './store/usePlayback';
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

  // Run once when you click "Run" (precompute slices & metrics)
  const onRun = () => {
    const result = runSchedule(state.processes, { algorithm: state.algorithm, quantum: state.quantum });
    dispatch({ type: 'setResult', payload: result });
  };

  // Derive max time from result
  const maxTime = useMemo(() => {
    if (!state.result) return 0;
    return state.result.slices.reduce((m, s) => Math.max(m, s.end), 0);
  }, [state.result]);

  // Playback hook
  const { t, isPlaying, play, pause, reset, step, speed, setSpeed, setTime } = usePlayback(maxTime);

  // When we recompute a new schedule, reset the playhead
  useEffect(() => { reset(); }, [state.result]); // reset timeline after new run

  // Optional: find which PID is active at time t
  const activePid = useMemo(() => {
    if (!state.result) return null;
    const s = state.result.slices.find(sl => t >= sl.start && t < sl.end);
    return s ? s.pid : null;
  }, [state.result, t]);

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

      {state.result && (
        <>
          <SimControls
            t={t}
            maxTime={maxTime}
            isPlaying={isPlaying}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onStep={step}
            speed={speed}
            setSpeed={setSpeed}
            setTime={setTime}
          />

          <Gantt
            slices={state.result.slices}
            processes={state.processes}
            currentTime={t}
          />

          <MetricsPanel metrics={state.result.metrics} />
        </>
      )}
    </div>
  );
}
