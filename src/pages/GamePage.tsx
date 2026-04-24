import { useEffect, useRef, useState } from "react";
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

export function GamePage() {
  const { roomId, text, nickname, playerId } = useRoom();
  const setScreen = useGameStore((s) => s.setScreen);
  const setMyResult = useGameStore((s) => s.setMyResult);

  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typing = useTyping(text);
  const { start: startTyping, tick, progress, currentIndex, metrics } = typing;
  const { opponents } = useGame(started);
  const { sendProgress, sendFinish } = useWebSocket(roomId);

  // 카운트다운
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

  // 경과 시간 틱
  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(() => tick(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [started, tick]);

  // 진행률 서버 전송
  useEffect(() => {
    if (!started || !playerId) return;
    sendProgress({ playerId, progress, currentIndex });
  }, [progress, currentIndex, started, playerId, sendProgress]);

  // 완료 감지
  useEffect(() => {
    if (metrics && playerId) {
      sendFinish({ playerId, wpm: metrics.wpm, accuracy: metrics.accuracy });
      setMyResult(metrics);
      const id = window.setTimeout(() => setScreen("result"), 300);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [metrics, playerId, sendFinish, setMyResult, setScreen]);

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
            GET READY
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
            TYPING BATTLE
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
            fontFamily: PIXEL_FONT,
            fontSize: "7px",
            color: "#555",
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          <DinoSprite size={14} /> {typing.input.length} / {text.length} characters
        </div>
      </div>
    </div>
  );
}
