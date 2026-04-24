import { useGameStore } from "@/store/useGameStore";
import { globalStyles } from "@/styles/globalStyles";
import { HomePage } from "@/pages/HomePage";
import { WaitingRoomPage } from "@/pages/WaitingRoomPage";
import { GamePage } from "@/pages/GamePage";
import { ResultPage } from "@/pages/ResultPage";

export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <>
      <style>{globalStyles}</style>
      {screen === "home" && <HomePage />}
      {screen === "waiting" && <WaitingRoomPage />}
      {screen === "game" && <GamePage />}
      {screen === "result" && <ResultPage />}
    </>
  );
}
