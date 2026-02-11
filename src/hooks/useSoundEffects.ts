import { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore";
import { soundEngine } from "../engine/sound";
import type { GameStatus } from "../types/game";

/* ========================================
   useSoundEffects Hook
   Subscribes to game state changes and
   triggers the appropriate sound effects.
   ======================================== */

/**
 * Plays sounds reactively based on score increments and status transitions.
 *
 * - **score**  → plays "score" ding when score increases
 * - **hit**    → plays "hit" thump on playing → gameOver transition
 * - **swoosh** → plays "swoosh" whoosh on idle → playing transition
 *
 * Note: The "flap" sound is triggered imperatively from the
 * interaction handler for zero-latency response.
 */
export const useSoundEffects = (): void => {
  const score = useGameStore((s) => s.score);
  const status = useGameStore((s) => s.status);

  const prevScoreRef = useRef<number>(score);
  const prevStatusRef = useRef<GameStatus>(status);

  /* Score change → coin ding */
  useEffect(() => {
    if (score > prevScoreRef.current && status === "playing") {
      soundEngine.play("score");
    }
    prevScoreRef.current = score;
  }, [score, status]);

  /* Status transition sounds */
  useEffect(() => {
    const prevStatus = prevStatusRef.current;

    /* playing → gameOver = collision hit */
    if (status === "gameOver" && prevStatus === "playing") {
      soundEngine.play("hit");
    }

    /* idle → playing = start swoosh */
    if (status === "playing" && prevStatus === "idle") {
      soundEngine.play("swoosh");
    }

    prevStatusRef.current = status;
  }, [status]);
};
