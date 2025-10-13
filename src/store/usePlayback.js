import { useEffect, useRef, useState } from 'react';

/** Discrete-time playback; speed = ticks per second */
export default function usePlayback(maxTime = 0) {
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;
    const loop = (now) => {
      if (!lastRef.current) lastRef.current = now;
      const msPerTick = 1000 / Math.max(0.25, speed);
      if (now - lastRef.current >= msPerTick) {
        setT(prev => {
          const next = Math.min(prev + 1, maxTime);
          if (next >= maxTime) setIsPlaying(false);
          return next;
        });
        lastRef.current = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
    };
  }, [isPlaying, speed, maxTime]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const reset = () => { setIsPlaying(false); setT(0); };
  const step = () => setT(prev => Math.min(prev + 1, maxTime));
  const setTime = (val) => setT(Math.max(0, Math.min(val, maxTime)));

  return { t, isPlaying, play, pause, reset, step, speed, setSpeed, setTime };
}
