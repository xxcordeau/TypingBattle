import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/store/useGameStore";

/**
 * 방 상태 접근을 단순화하기 위한 selector 훅.
 * useShallow 로 감싸서 관련 필드만 바뀌었을 때 리렌더.
 */
export function useRoom() {
  return useGameStore(
    useShallow((s) => ({
      roomId: s.roomId,
      roomCode: s.roomCode,
      isHost: s.isHost,
      isSpectator: s.isSpectator,
      maxPlayers: s.maxPlayers,
      players: s.players,
      text: s.text,
      textType: s.textType,
      nickname: s.nickname,
      playerId: s.playerId,
      leaveRoom: s.leaveRoom,
      forfeited: s.forfeited,
      forfeit: s.forfeit,
    }))
  );
}
