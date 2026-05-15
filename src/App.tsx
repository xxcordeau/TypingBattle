import { useGameStore } from "@/store/useGameStore";
import { globalStyles } from "@/styles/globalStyles";
import { HomePage } from "@/pages/HomePage";
import { WaitingRoomPage } from "@/pages/WaitingRoomPage";
import { GamePage } from "@/pages/GamePage";
import { RoundResultPage } from "@/pages/RoundResultPage";
import { ResultPage } from "@/pages/ResultPage";
import { Toast } from "@/components/common/Toast";

export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <>
      <style>{globalStyles}</style>
      <Toast />
      {screen === "home" && <HomePage />}
      {screen === "waiting" && <WaitingRoomPage />}
      {screen === "game" && <GamePage />}
      {screen === "roundResult" && <RoundResultPage />}
      {screen === "result" && <ResultPage />}
    </>
  );
}
