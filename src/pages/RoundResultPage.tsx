import { useEffect, useState } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";
import { PixelBox } from "@/components/common/PixelBox";
import { ResultTable } from "@/components/result/ResultTable";

export function RoundResultPage() {
  const {
    currentRound,
    totalRounds,
    wins,
    roundWinnerId,
    players,
    results,
    playerId,
    resetRound,
    setScreen,
  } = useGameStore();

  const [countdown, setCountdown] = useState<number | null>(null);

  const winnerName =
    players.find((p) => p.playerId === roundWinnerId)?.playerName ?? "???";
  const isMe = roundWinnerId === playerId;

  useEffect(() => {
    const id = window.setTimeout(() => setCountdown(3), 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      resetRound();
      setScreen("game");
      return;
    }
    const id = window.setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown, resetRound, setScreen]);

  const sortedWins = Object.entries(wins)
    .map(([pid, w]) => ({
      name: players.find((p) => p.playerId === pid)?.playerName ?? pid,
      wins: w,
    }))
    .sort((a, b) => b.wins - a.wins);

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
        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
            animation: "floatUp 0.4s ease both",
          }}
        >
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#888",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            ROUND {currentRound} / {totalRounds}
          </div>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "16px",
              color: isMe ? "#007700" : "#cc2200",
              letterSpacing: "2px",
              textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
            }}
          >
            {isMe ? "YOU WIN!" : `${winnerName} WINS!`}
          </div>
        </div>

        <PixelBox style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#555",
              marginBottom: "12px",
              letterSpacing: "1px",
            }}
          >
            SCORE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {sortedWins.map((entry) => (
              <div
                key={entry.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: PIXEL_FONT,
                  fontSize: "9px",
                  color: "#1a1a1a",
                }}
              >
                <span>{entry.name}</span>
                <span>
                  {"★".repeat(entry.wins)}
                  {"☆".repeat(Math.max(0, Math.ceil(totalRounds / 2) - entry.wins))}
                </span>
              </div>
            ))}
          </div>
        </PixelBox>

        {results.length > 0 && <ResultTable results={results} />}

        <div
          style={{
            textAlign: "center",
            fontFamily: PIXEL_FONT,
            fontSize: "8px",
            color: "#888",
            marginTop: "16px",
          }}
        >
          {countdown !== null ? (
            <span>
              NEXT ROUND IN{" "}
              <span style={{ color: "#1a1a1a", fontSize: "12px" }}>{countdown}</span>
            </span>
          ) : (
            <span style={{ animation: "blink 1.2s step-end infinite" }}>...</span>
          )}
        </div>
      </div>
    </div>
  );
}
