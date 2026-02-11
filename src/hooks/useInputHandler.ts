import { useEffect, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { soundEngine } from "../engine/sound";

/* ========================================
   useInputHandler Hook
   Handles keyboard and touch inputs for the game.
   ======================================== */

/**
 * Custom hook that binds keyboard and touch events to game actions.
 * - Space / ArrowUp / Click / Tap: flap (playing) or start (idle)
 * - Space / Enter / Click / Tap: restart (gameOver)
 */
export const useInputHandler = (): void => {
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const flap = useGameStore((s) => s.flap);
  const reset = useGameStore((s) => s.reset);

  const handleAction = useCallback(() => {
    switch (status) {
      case "idle":
        startGame();
        break;
      case "playing":
        soundEngine.play("flap");
        flap();
        break;
      case "gameOver":
        reset();
        break;
    }
  }, [status, startGame, flap, reset]);

  /* Keyboard handler */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "Enter"].includes(e.code)) {
        e.preventDefault();
        handleAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAction]);

  return;
};
