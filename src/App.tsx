import { Routes, Route, Navigate } from "react-router-dom";
import GamePage from "./pages/GamePage";

/**
 * Root application component with route configuration.
 * Single route: / renders the game page.
 */
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
