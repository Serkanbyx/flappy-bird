import { useGameStore } from "../store/useGameStore";

/* ========================================
   StartScreen Component
   Overlay shown when game is in idle state.
   ======================================== */

const StartScreen = () => {
  const status = useGameStore((s) => s.status);
  const bestScore = useGameStore((s) => s.bestScore);
  const startGame = useGameStore((s) => s.startGame);

  if (status !== "idle") return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer"
      onClick={startGame}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") startGame();
      }}
      aria-label="Start game"
    >
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/30 rounded-lg" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Title */}
        <h1 className="text-3xl text-yellow-400 font-game text-shadow-game animate-float">
          Flappy Bird
        </h1>

        {/* Bird icon placeholder */}
        <div className="text-5xl animate-bounce-slow">🐤</div>

        {/* Instructions */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-white font-game text-shadow-game animate-pulse-fast">
            Tap or Press Space
          </p>
          <p className="text-xs text-white/70 font-game text-shadow-game">
            to start
          </p>
        </div>

        {/* Best score */}
        {bestScore > 0 && (
          <div className="mt-4 px-4 py-2 bg-black/40 rounded-lg border border-white/20 animate-slide-up">
            <p className="text-xs text-yellow-300 font-game text-shadow-game">
              Best: {bestScore}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
