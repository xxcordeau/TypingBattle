import { useEffect, useMemo } from "react";
import type { GameResult } from "@/types";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";
import { MOCK_RESULTS } from "@/constants/mockData";
import { fetchResult } from "@/api/roomApi";
import { PixelButton } from "@/components/common/PixelButton";
import { ResultTable } from "@/components/result/ResultTable";

export function ResultPage() {
  const { roomId, nickname, myResult, results, setResults, setScreen, resetGame, leaveRoom } =
    useGameStore();

  useEffect(() => {
    if (!roomId) return;
    fetchResult(roomId).then((res) => {
      setResults(res.results);
    });
  }, [roomId, setResults]);

  // 내 결과를 상단에 머지 (mock)
  const merged: GameResult[] = useMemo(() => {
    const base = results.length ? results : MOCK_RESULTS;
    if (!myResult) return base;
    const me: GameResult = {
      rank: 1,
      playerId: "me",
      playerName: nickname || "YOU",
      wpm: myResult.wpm,
      accuracy: myResult.accuracy,
      finishedAt: new Date().toISOString(),
    };
    return [me, ...base.slice(1)];
  }, [results, myResult, nickname]);

  const handleReplay = () => {
    resetGame();
    setScreen("game");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0ece0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "floatUp 0.4s ease both" }}>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "20px",
              color: "#1a1a1a",
              letterSpacing: "2px",
              textShadow: "3px 3px 0px rgba(0,0,0,0.1)",
            }}
          >
            GAME OVER
          </div>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: "8px", color: "#888", marginTop: "8px" }}>
            ────────────────────
          </div>
        </div>

        <ResultTable results={merged} />

        <div style={{ display: "flex", gap: "10px" }}>
          <PixelButton
            style={{ flex: 1, padding: "14px", fontSize: "9px" }}
            onClick={handleReplay}
          >
            ▶ PLAY AGAIN
          </PixelButton>
          <PixelButton
            variant="secondary"
            style={{ flex: 1, padding: "14px", fontSize: "9px" }}
            onClick={leaveRoom}
          >
            HOME
          </PixelButton>
        </div>

        <div
          style={{
            fontFamily: PIXEL_FONT,
            fontSize: "7px",
            color: "#bbb",
            textAlign: "center",
            marginTop: "16px",
          }}
        >
          ────────────────────
          <br />
          <span
            style={{
              animation: "blink 1.2s step-end infinite",
              display: "inline-block",
              marginTop: "8px",
            }}
          >
            GG!
          </span>
        </div>
      </div>
    </div>
  );
}
