import React, { useEffect, useMemo, useReducer } from 'react';
import ProcessTable from './components/ProcessTable.jsx';
import Controls from './components/Controls.jsx';
import Gantt from './components/Gantt.jsx';
import MetricsPanel from './components/MetricsPanel.jsx';
import ImportExport from './components/ImportExport.jsx';

// NEW: playback controls + hook
import SimControls from './components/SimControls.jsx';
import usePlayback from './store/usePlayback';

// Your existing engine (precomputes full schedule)
import { runSchedule } from './sim/engine';

// Your existing reducer/initial state
import { reducer, initialState } from './store/reducer';

export default function App() {
  // state init with persistence
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem('scheduler_state');
    return saved ? JSON.parse(saved) : init;
  });

  // persist on change
  useEffect(() => {
    localStorage.setItem('scheduler_state', JSON.stringify(state));
  }, [state]);

  const setProcesses = (p) => dispatch({ type: 'setProcesses', payload: p });

  // RUN: compute slices/metrics once (no animation here)
  const onRun = () => {
    const result = runSchedule(state.processes, {
      algorithm: state.algorithm,
      quantum: state.quantum,
    });
    dispatch({ type: 'setResult', payload: result });
  };

  // playback derived data
  const maxTime = useMemo(() => {
    if (!state.result) return 0;
    return state.result.slices.reduce((m, s) => Math.max(m, s.end), 0);
  }, [state.result]);

  const {
    t,
    isPlaying,
    play,
    pause,
    reset,
    step,
    speed,
    setSpeed,
    setTime,
  } = usePlayback(maxTime);

  // whenever we compute a new schedule, reset the playhead
  useEffect(() => {
    reset();
  }, [state.result]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Process Scheduler (JS)</h2>

      <ImportExport processes={state.processes} setProcesses={setProcesses} />

      <ProcessTable processes={state.processes} setProcesses={setProcesses} />

      <Controls
        algorithm={state.algorithm}
        quantum={state.quantum}
        setAlgorithm={(a) => dispatch({ type: 'setAlgorithm', payload: a })}
        setQuantum={(q) => dispatch({ type: 'setQuantum', payload: q })}
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
            currentTime={t}             // << grows the chart as time advances
            showFutureFaded={true}      // << purely cosmetic
          />

          <MetricsPanel metrics={state.result.metrics} />
        </>
      )}
    </div>
  );
}
