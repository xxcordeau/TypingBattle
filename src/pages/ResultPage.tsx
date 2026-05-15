import { useEffect, useMemo } from "react";
import type { GameResult } from "@/types";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";
import { fetchResult } from "@/api/roomApi";
import { PixelButton } from "@/components/common/PixelButton";
import { PixelBox } from "@/components/common/PixelBox";
import { ResultTable } from "@/components/result/ResultTable";

export function ResultPage() {
  const {
    roomId,
    nickname,
    playerId,
    myResult,
    results,
    setResults,
    leaveRoom,
    totalRounds,
    wins,
    players,
  } = useGameStore();

  useEffect(() => {
    if (!roomId) return;
    fetchResult(roomId).then((res) => {
      setResults(res.results);
    });
  }, [roomId, setResults]);

  const merged: GameResult[] = useMemo(() => {
    const base = results;
    if (!myResult) return base;
    const me: GameResult = {
      rank: 1,
      playerId: playerId ?? "me",
      playerName: nickname || "YOU",
      wpm: myResult.wpm,
      accuracy: myResult.accuracy,
      finishedAt: new Date().toISOString(),
    };
    return [me, ...base.filter((r) => r.playerId !== playerId)];
  }, [results, myResult, nickname, playerId]);

  const sortedWins = Object.entries(wins)
    .map(([pid, w]) => ({
      pid,
      name: players.find((p) => p.playerId === pid)?.playerName ?? pid,
      wins: w,
    }))
    .sort((a, b) => b.wins - a.wins);

  const overallWinner = sortedWins.length > 0 ? sortedWins[0] : null;
  const iWon = overallWinner?.pid === playerId;

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
          {totalRounds > 1 && overallWinner && (
            <div
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "11px",
                color: iWon ? "#007700" : "#cc2200",
                marginTop: "12px",
                letterSpacing: "1px",
              }}
            >
              {iWon ? "YOU WIN!" : `${overallWinner.name} WINS!`}
            </div>
          )}
          <div style={{ fontFamily: PIXEL_FONT, fontSize: "8px", color: "#888", marginTop: "8px" }}>
            ────────────────────
          </div>
        </div>

        {totalRounds > 1 && sortedWins.length > 0 && (
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
              FINAL SCORE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {sortedWins.map((entry) => (
                <div
                  key={entry.pid}
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
                    {"★".repeat(entry.wins)} ({entry.wins}W)
                  </span>
                </div>
              ))}
            </div>
          </PixelBox>
        )}

        <ResultTable results={merged} />

        <div style={{ display: "flex", gap: "10px" }}>
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
