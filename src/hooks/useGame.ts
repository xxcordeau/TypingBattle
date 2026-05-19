import { useCallback, useEffect, useRef, useState } from "react";
import type { GamePlayer, GameTopicMessage } from "@/types";
import { useMock } from "@/api/client";
import { useRoom } from "./useRoom";

export function useGame(started: boolean) {
  const { players, playerId, isSpectator } = useRoom();
  const others = players.filter((p) => p.playerId !== playerId && !p.isSpectator);

  const [opponentsState, setOpponentsState] = useState<GamePlayer[]>(() =>
    others.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      progress: 0,
      isFinished: false,
    })),
  );

  const [countdownEnd, setCountdownEnd] = useState<number | null>(null);
  const countdownSetRef = useRef(false);

  const onGameUpdate = useCallback((msg: GameTopicMessage) => {
    if (isSpectator) {
      setOpponentsState(msg.players);
    } else {
      setOpponentsState(msg.players.filter((p) => p.playerId !== playerId));
    }
    if (msg.countdownSeconds != null && !countdownSetRef.current) {
      countdownSetRef.current = true;
      setCountdownEnd(Date.now() + msg.countdownSeconds * 1000);
    }
  }, [playerId, isSpectator]);

  // mock 모드: 상대방 진행률 시뮬레이션
  useEffect(() => {
    if (!useMock() || !started) return;
    const id = window.setInterval(() => {
      setOpponentsState((prev) =>
        prev.map((p) =>
          p.isFinished || p.forfeited
            ? p
            : {
                ...p,
                progress: Math.min(100, p.progress + Math.random() * 2.5),
                isFinished: p.progress >= 100,
              },
        ),
      );
    }, 300);
    return () => window.clearInterval(id);
  }, [started]);

  return { opponents: opponentsState, onGameUpdate, countdownEnd };
}
