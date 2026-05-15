import { useCallback, useEffect, useState } from "react";
import type { GamePlayer, GameTopicMessage } from "@/types";
import { useMock } from "@/api/client";
import { useRoom } from "./useRoom";

export function useGame(started: boolean) {
  const { players, playerId } = useRoom();
  const opponents = players.filter((p) => p.playerId !== playerId);

  const [opponentsState, setOpponentsState] = useState<GamePlayer[]>(() =>
    opponents.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      progress: 0,
      isFinished: false,
    })),
  );

  const onGameUpdate = useCallback((msg: GameTopicMessage) => {
    setOpponentsState(
      msg.players.filter((p) => p.playerId !== playerId),
    );
  }, [playerId]);

  // mock 모드: 상대방 진행률 시뮬레이션
  useEffect(() => {
    if (!useMock() || !started) return;
    const id = window.setInterval(() => {
      setOpponentsState((prev) =>
        prev.map((p) =>
          p.isFinished
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

  return { opponents: opponentsState, onGameUpdate };
}
