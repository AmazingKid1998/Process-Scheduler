import React from 'react';

export default function SimControls({ t, maxTime, isPlaying, onPlay, onPause, onReset, onStep, speed, setSpeed, setTime }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
      <button onClick={isPlaying ? onPause : onPlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={onStep} disabled={isPlaying || t >= maxTime}>Step +1</button>
      <button onClick={onReset}>Reset</button>

      <label style={{ marginLeft: 8 }}>
        Speed:
        <select value={speed} onChange={e => setSpeed(+e.target.value)} style={{ marginLeft: 4 }}>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={4}>4x</option>
          <option value={8}>8x</option>
        </select>
      </label>

      <input
        type="range"
        min="0"
        max={maxTime}
        step="1"
        value={t}
        onChange={(e) => setTime(+e.target.value)}
        style={{ width: 240 }}
      />
      <span>{t} / {maxTime}</span>
    </div>
  );
}
