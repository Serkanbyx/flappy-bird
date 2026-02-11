import { useRef, useEffect, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { useGameLoop } from "../hooks/useGameLoop";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TARGET_FRAME_MS,
} from "../constants/game";
import {
  clearCanvas,
  drawBackground,
  drawPipes,
  drawGround,
  drawBird,
  drawScore,
  drawIdleBird,
} from "../engine/renderer";

/* ========================================
   GameCanvas Component
   Core canvas element that renders the game.
   ======================================== */

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Accumulated animation time in ms (frame-rate independent) */
  const animTimeRef = useRef(0);

  const status = useGameStore((s) => s.status);
  const bird = useGameStore((s) => s.bird);
  const pipes = useGameStore((s) => s.pipes);
  const groundOffset = useGameStore((s) => s.groundOffset);
  const score = useGameStore((s) => s.score);
  const tick = useGameStore((s) => s.tick);

  /** Main render function - draws everything to canvas */
  const render = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      /* Accumulate real elapsed time for animations */
      animTimeRef.current += deltaTime;

      /* Convert accumulated ms to a 60fps-equivalent frame count.
         This keeps wing flap speed consistent across all refresh rates. */
      const normalizedFrame = animTimeRef.current / TARGET_FRAME_MS;

      clearCanvas(ctx);
      drawBackground(ctx);
      drawPipes(ctx, pipes);
      drawGround(ctx, groundOffset);

      if (status === "idle") {
        drawIdleBird(ctx, normalizedFrame);
      } else {
        drawBird(ctx, bird, normalizedFrame);
      }

      if (status === "playing") {
        drawScore(ctx, score);
      }
    },
    [status, bird, pipes, groundOffset, score]
  );

  /** Game loop: tick physics with deltaTime then render */
  const gameStep = useCallback(
    (deltaTime: number) => {
      tick(deltaTime);
      render(deltaTime);
    },
    [tick, render]
  );

  /* Use game loop only when playing */
  useGameLoop(gameStep, status === "playing");

  /* Render idle & gameOver states without physics */
  useEffect(() => {
    if (status !== "playing") {
      let lastTime = 0;

      const idleLoop = (timestamp: number) => {
        if (lastTime === 0) lastTime = timestamp;
        const dt = Math.min(timestamp - lastTime, 33.33);
        lastTime = timestamp;

        render(dt);

        if (status === "idle") {
          return requestAnimationFrame(idleLoop);
        }
        /* Render once more for gameOver */
        return 0;
      };
      const id = requestAnimationFrame(idleLoop);
      return () => cancelAnimationFrame(id);
    }
  }, [status, render]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="block max-h-full max-w-full rounded-lg shadow-2xl"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export default GameCanvas;
