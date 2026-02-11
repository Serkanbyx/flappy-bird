import { useRef, useEffect, useCallback } from "react";

/* ========================================
   useGameLoop Hook
   Provides a stable requestAnimationFrame loop.
   ======================================== */

/**
 * Custom hook that manages a game loop using requestAnimationFrame.
 * @param callback - Function called every frame with elapsed time.
 * @param isRunning - Whether the loop should be active.
 */
export const useGameLoop = (
  callback: (deltaTime: number) => void,
  isRunning: boolean
): void => {
  const rafIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  /* Keep callback ref current without re-triggering effect */
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    /* Cap delta to prevent huge jumps after tab switch */
    const cappedDelta = Math.min(deltaTime, 33.33);
    callbackRef.current(cappedDelta);

    rafIdRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [isRunning, loop]);
};
