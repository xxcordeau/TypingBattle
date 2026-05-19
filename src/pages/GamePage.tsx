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
import type { ResultTopicMessage, RoomTopicMessage } from "@/types";

export function GamePage() {
  const { roomId, text, textType, nickname, playerId, isSpectator, leaveRoom, forfeited, forfeit } = useRoom();
  const textLang = textType === "korean" ? "ko" : "en";
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
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [wrongLang, setWrongLang] = useState(false);
  const wrongLangTimer = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typing = useTyping(text);
  const { start: startTyping, tick, progress, currentIndex, metrics } = typing;
  const { opponents, onGameUpdate, countdownEnd } = useGame(started);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
        const rounds = msg.totalRounds ?? useGameStore.getState().totalRounds;
        if (rounds <= 1) return;
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

  const setPlayers = useGameStore((s) => s.setPlayers);

  const onRoomUpdate = useCallback(
    (msg: RoomTopicMessage) => {
      if (msg.type === "ROOM_CLOSED") {
        leaveRoom();
        return;
      }
      if (msg.type === "PLAYER_LEFT") {
        if (msg.players) setPlayers(msg.players);
        const activePlayers = (msg.players ?? []).filter((p) => !p.isSpectator);
        if (activePlayers.length <= 1) {
          setOpponentLeft(true);
          if (isSpectator) {
            setTimeout(() => leaveRoom(), 2000);
          }
        }
      }
    },
    [leaveRoom, isSpectator, setPlayers],
  );

  const { sendProgress, sendFinish, sendForfeit } = useWebSocket(roomId, {
    onRoomUpdate,
    onGameUpdate,
    onResult,
  });

  useEffect(() => {
    if (countdown <= 0) {
      setStarted(true);
      startTyping();
      return;
    }
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown, startTyping]);

  useEffect(() => {
    if (started) {
      inputRef.current?.focus();
    }
  }, [started]);

  useEffect(() => {
    if (isSpectator) {
      setCountdown(0);
      setStarted(true);
      return;
    }
    if (!started) return;
    const id = window.setInterval(() => tick(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [started, tick, isSpectator]);

  useEffect(() => {
    if (isSpectator || !started || !playerId || forfeited) return;
    sendProgress({ playerId, progress, currentIndex });
  }, [progress, currentIndex, started, playerId, sendProgress, isSpectator, forfeited]);

  useEffect(() => {
    if (isSpectator) return;
    if (metrics && playerId) {
      sendFinish({ playerId, wpm: metrics.wpm, accuracy: metrics.accuracy });
      setMyResult(metrics);
      setWaitingForOthers(true);
    }
    return undefined;
  }, [metrics, playerId, sendFinish, setMyResult, isSpectator]);

  useEffect(() => {
    if (countdownEnd === null) return;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((countdownEnd - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [countdownEnd]);

  const handleForfeit = () => {
    if (!playerId || forfeited) return;
    forfeit();
    sendForfeit({ playerId });
  };

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
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "9px",
              color: textType === "korean" ? "#ffaa00" : "#66aaff",
              letterSpacing: "2px",
              marginTop: "4px",
            }}
          >
            {textType === "korean" ? "한글 입력으로 전환하세요" : textType === "english" ? "SWITCH TO ENGLISH INPUT" : ""}
          </div>
        </div>
      )}

      {opponentLeft && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "11px",
              color: "#cc2200",
              letterSpacing: "2px",
            }}
          >
            상대방이 나갔습니다
          </div>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#888",
            }}
          >
            OPPONENT LEFT · RETURNING HOME...
          </div>
        </div>
      )}

      {waitingForOthers && !opponentLeft && (
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
              fontSize: "20px",
              color: (timeLeft ?? 80) <= 10 ? "#cc2200" : "#f0ece0",
              marginTop: "4px",
            }}
          >
            {timeLeft ?? "—"}s
          </div>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "7px",
              color: "#888",
            }}
          >
            ▶ WPM: {metrics?.wpm ?? 0} · ACC: {metrics?.accuracy ?? 0}%
          </div>
          <button
            onClick={handleQuit}
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#cc2200",
              background: "none",
              border: "1px solid #cc2200",
              padding: "8px 20px",
              cursor: "pointer",
              marginTop: "8px",
              letterSpacing: "1px",
            }}
          >
            LEAVE GAME
          </button>
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
            {timeLeft !== null && !waitingForOthers ? (
              <span style={{ color: timeLeft <= 10 ? "#cc2200" : "#ffaa00", letterSpacing: "1px" }}>
                ⏱ {timeLeft}s
              </span>
            ) : totalRounds > 1 ? (
              `ROUND ${currentRound} / ${totalRounds}`
            ) : (
              "TYPING BATTLE"
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {started && !forfeited && !isSpectator && !metrics && !waitingForOthers && (
              <button
                onClick={handleForfeit}
                style={{
                  fontFamily: PIXEL_FONT,
                  fontSize: "7px",
                  padding: "4px 10px",
                  background: "transparent",
                  border: "2px solid #c44",
                  color: "#c44",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                FORFEIT
              </button>
            )}
            <div style={{ fontFamily: PIXEL_FONT, fontSize: "9px", color: "#f0ece0" }}>
              {typing.progress}%
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          {!isSpectator && (
            <ProgressBar
              progress={typing.progress}
              animate={started && !forfeited && typing.progress < 100}
              label={nickname || "YOU"}
              forfeited={forfeited}
            />
          )}
          <OtherPlayersBar players={opponents} />
        </div>

        {forfeited && !isSpectator ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 16px",
              marginBottom: "12px",
              border: "2px solid #555",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "12px",
                color: "#c44",
                letterSpacing: "3px",
                marginBottom: "8px",
              }}
            >
              FORFEITED
            </div>
            <div
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "7px",
                color: "#888",
                animation: "blink 1.2s step-end infinite",
              }}
            >
              watching other players...
            </div>
          </div>
        ) : isSpectator ? (
          <div
            style={{
              background: "#1a1a1a",
              border: "3px solid #555",
              padding: "24px",
              textAlign: "center",
              fontFamily: PIXEL_FONT,
              fontSize: "9px",
              color: "#888",
              letterSpacing: "2px",
            }}
          >
            SPECTATING...
          </div>
        ) : (
          <>
          {wrongLang && (
            <div
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "8px",
                color: "#ffaa00",
                textAlign: "center",
                marginBottom: "6px",
                letterSpacing: "1px",
                animation: "popIn 0.2s ease",
              }}
            >
              {textType === "korean" ? "⚠ 한글로 전환하세요 (한/영 키)" : "⚠ SWITCH TO ENGLISH (한/영 KEY)"}
            </div>
          )}
          <TypingArea
            ref={inputRef}
            text={text}
            input={typing.input}
            composing={typing.composing}
            shakeIndex={typing.shakeIndex}
            started={started}
            lang={textLang}
            onChange={(e) => {
              const val = e.target.value;
              // 잘못된 언어 입력 감지
              if (val.length > 0 && textType !== "custom") {
                const last = val[val.length - 1];
                const isKorChar = /[ㄱ-ㅣ가-힣]/.test(last);
                const isEngChar = /[a-zA-Z]/.test(last);
                if ((textType === "korean" && isEngChar) || (textType === "english" && isKorChar)) {
                  setWrongLang(true);
                  if (wrongLangTimer.current) clearTimeout(wrongLangTimer.current);
                  wrongLangTimer.current = window.setTimeout(() => setWrongLang(false), 2000);
                } else if (wrongLang) {
                  setWrongLang(false);
                }
              }
              typing.handleChange(val);
            }}
            onCompositionStart={typing.handleCompositionStart}
            onCompositionEnd={typing.handleCompositionEnd}
          />
          </>
        )}

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
