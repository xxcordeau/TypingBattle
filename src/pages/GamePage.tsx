import { useCallback, useEffect, useRef, useState } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";
import { useRoom } from "@/hooks/useRoom";
import { useGame } from "@/hooks/useGame";
import { useTyping } from "@/hooks/useTyping";
import { useWebSocket } from "@/hooks/useWebSocket";
import { DinoSprite } from "@/components/sprites/DinoSprite";
import { Timer } from "@/components/game/Timer";
import { ProgressBar } from "@/components/game/ProgressBar";
import { OtherPlayersBar } from "@/components/game/OtherPlayersBar";
import { TypingArea } from "@/components/game/TypingArea";
import type { ResultTopicMessage } from "@/types";

export function GamePage() {
  const { roomId, text, nickname, playerId, leaveRoom } = useRoom();
  const setScreen = useGameStore((s) => s.setScreen);
  const setMyResult = useGameStore((s) => s.setMyResult);
  const setResults = useGameStore((s) => s.setResults);
  const setRoundInfo = useGameStore((s) => s.setRoundInfo);
  const setText = useGameStore((s) => s.setText);
  const totalRounds = useGameStore((s) => s.totalRounds);
  const currentRound = useGameStore((s) => s.currentRound);

  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const [waitingForOthers, setWaitingForOthers] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typing = useTyping(text);
  const { start: startTyping, tick, progress, currentIndex, metrics } = typing;
  const { opponents, onGameUpdate } = useGame(started);

  const onResult = useCallback(
    (msg: ResultTopicMessage) => {
      if (msg.results) setResults(msg.results);
      if (msg.type === "ROUND_RESULT") {
        setRoundInfo({
          currentRound: msg.currentRound,
          totalRounds: msg.totalRounds,
          wins: msg.wins,
          roundWinnerId: msg.roundWinnerId,
        });
        setScreen("roundResult");
      } else if (msg.type === "GAME_OVER") {
        if (msg.wins) setRoundInfo({ wins: msg.wins });
        setScreen("result");
      } else if (msg.type === "NEXT_ROUND") {
        if (msg.text) setText(msg.text);
        setRoundInfo({
          currentRound: msg.currentRound,
          totalRounds: msg.totalRounds,
          wins: msg.wins,
        });
      }
    },
    [setResults, setRoundInfo, setScreen, setText],
  );

  const { sendProgress, sendFinish } = useWebSocket(roomId, {
    onGameUpdate,
    onResult,
  });

  useEffect(() => {
    if (countdown <= 0) {
      setStarted(true);
      startTyping();
      inputRef.current?.focus();
      return;
    }
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown, startTyping]);

  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(() => tick(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [started, tick]);

  useEffect(() => {
    if (!started || !playerId) return;
    sendProgress({ playerId, progress, currentIndex });
  }, [progress, currentIndex, started, playerId, sendProgress]);

  useEffect(() => {
    if (metrics && playerId) {
      sendFinish({ playerId, wpm: metrics.wpm, accuracy: metrics.accuracy });
      setMyResult(metrics);
      setWaitingForOthers(true);
      if (totalRounds <= 1) {
        const id = window.setTimeout(() => setScreen("result"), 500);
        return () => window.clearTimeout(id);
      }
    }
    return undefined;
  }, [metrics, playerId, sendFinish, setMyResult, totalRounds, setScreen]);

  const handleQuit = () => {
    leaveRoom();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {countdown > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#888",
              letterSpacing: "4px",
            }}
          >
            {totalRounds > 1 ? `ROUND ${currentRound} / ${totalRounds}` : "GET READY"}
          </div>
          <div
            key={countdown}
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "80px",
              color: "#f0ece0",
              animation: "popIn 0.4s ease",
              textShadow: "4px 4px 0px #555",
            }}
          >
            {countdown}
          </div>
        </div>
      )}

      {waitingForOthers && totalRounds > 1 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "10px",
              color: "#f0ece0",
              letterSpacing: "2px",
            }}
          >
            WAITING FOR OTHERS...
          </div>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "7px",
              color: "#888",
              animation: "blink 1.2s step-end infinite",
            }}
          >
            ▶ WPM: {metrics?.wpm ?? 0} · ACC: {metrics?.accuracy ?? 0}%
          </div>
        </div>
      )}

      <div style={{ width: "100%", maxWidth: "700px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Timer seconds={typing.elapsed} />
          <div style={{ fontFamily: PIXEL_FONT, fontSize: "9px", color: "#888" }}>
            {totalRounds > 1
              ? `ROUND ${currentRound} / ${totalRounds}`
              : "TYPING BATTLE"}
          </div>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: "9px", color: "#f0ece0" }}>
            {typing.progress}%
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <ProgressBar
            progress={typing.progress}
            animate={started && typing.progress < 100}
            label={nickname || "YOU"}
          />
          <OtherPlayersBar players={opponents} />
        </div>

        <TypingArea
          ref={inputRef}
          text={text}
          input={typing.input}
          shakeIndex={typing.shakeIndex}
          started={started}
          onChange={(e) => typing.handleChange(e.target.value)}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "7px",
              color: "#555",
            }}
          >
            <DinoSprite size={14} /> {typing.input.length} / {text.length}
          </div>
          <button
            onClick={handleQuit}
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "7px",
              color: "#cc2200",
              background: "none",
              border: "1px solid #cc2200",
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            QUIT
          </button>
        </div>
      </div>
    </div>
  );
}
