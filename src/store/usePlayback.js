import { useEffect, useState, useRef } from 'react';

/**
 * Discrete-time playback: advances 1 "tick" at a controllable rate.
 * speed = ticks per second (e.g., 1, 2, 4, 8)
 */
export default function usePlayback(maxTime = 0) {
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);      // ticks per second
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  // use rAF to be smooth but still advance in discreet ticks based on speed
  useEffect(() => {
    if (!isPlaying) return;

    const step = (now) => {
      if (!lastRef.current) lastRef.current = now;
      const elapsed = now - lastRef.current; // ms
      const msPerTick = 1000 / Math.max(1, speed);

      if (elapsed >= msPerTick) {
        setT(prev => {
          const next = Math.min(prev + 1, maxTime);
          // auto-pause at the end
          if (next >= maxTime) {
            setIsPlaying(false);
          }
          return next;
        });
        lastRef.current = now;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
    };
  }, [isPlaying, speed, maxTime]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const reset = () => { setT(0); setIsPlaying(false); };
  const step = () => setT(prev => Math.min(prev + 1, maxTime));
  const setTime = (val) => setT(Math.max(0, Math.min(val, maxTime)));

  return { t, isPlaying, play, pause, reset, step, speed, setSpeed, setTime };
}
