import GameCanvas from "../components/GameCanvas";
import StartScreen from "../components/StartScreen";
import GameOverScreen from "../components/GameOverScreen";
import { useInputHandler } from "../hooks/useInputHandler";
import { useGameStore } from "../store/useGameStore";

/* ========================================
   GamePage
   Main game page that composes canvas and UI overlays.
   ======================================== */

const GamePage = () => {
  /* Bind keyboard/touch input handlers */
  useInputHandler();

  const status = useGameStore((s) => s.status);
  const flap = useGameStore((s) => s.flap);
  const startGame = useGameStore((s) => s.startGame);
  const reset = useGameStore((s) => s.reset);

  /** Handle click/touch on game container */
  const handleInteraction = () => {
    switch (status) {
      case "idle":
        startGame();
        break;
      case "playing":
        flap();
        break;
      case "gameOver":
        reset();
        break;
    }
  };

  return (
    <div className="game-container bg-black">
      <div
        className="relative"
        onClick={handleInteraction}
        onTouchStart={(e) => {
          e.preventDefault();
          handleInteraction();
        }}
        role="application"
        aria-label="Flappy Bird Game"
      >
        {/* Canvas game rendering */}
        <GameCanvas />

        {/* UI Overlays */}
        <StartScreen />
        <GameOverScreen />
      </div>
    </div>
  );
};

export default GamePage;
