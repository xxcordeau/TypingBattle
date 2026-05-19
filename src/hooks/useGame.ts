import { useEffect, useState } from "react";
import type { GamePlayer } from "@/types";
import { useRoom } from "./useRoom";

/**
 * 게임 진행 상태 (상대방 진행률 시뮬레이션).
 * 실제로는 WebSocket /topic/game/{roomId} 에서 받아 반영.
 */
export function useGame(started: boolean) {
  const { players, playerId } = useRoom();
  const opponents = players.filter((p) => p.playerId !== playerId);

  const [opponentsState, setOpponentsState] = useState<GamePlayer[]>(() =>
    opponents.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      progress: 0,
      isFinished: false,
      forfeited: false,
    }))
  );

  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(() => {
      setOpponentsState((prev) =>
        prev.map((p) =>
          p.isFinished || p.forfeited
            ? p
            : {
                ...p,
                progress: Math.min(100, p.progress + Math.random() * 2.5),
                isFinished: p.progress >= 100,
              }
        )
      );
    }, 300);
    return () => window.clearInterval(id);
  }, [started]);

  return { opponents: opponentsState };
}
