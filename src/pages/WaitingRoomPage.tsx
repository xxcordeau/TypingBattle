import { useCallback, useEffect, useState } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";
import { useRoom } from "@/hooks/useRoom";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { RoomTopicMessage } from "@/types";
import { PlayerList } from "@/components/waiting/PlayerList";
import { RoomCodeShare } from "@/components/waiting/RoomCodeShare";
import { StartButton } from "@/components/waiting/StartButton";
import { ConnectionBadge } from "@/components/common/ConnectionBadge";

export function WaitingRoomPage() {
  const { roomId, roomCode, players, isHost, maxPlayers, leaveRoom } = useRoom();
  const setScreen = useGameStore((s) => s.setScreen);
  const setPlayers = useGameStore((s) => s.setPlayers);
  const setRoundInfo = useGameStore((s) => s.setRoundInfo);
  const totalRounds = useGameStore((s) => s.totalRounds);
  const [dots, setDots] = useState("");

  const onRoomUpdate = useCallback(
    (msg: RoomTopicMessage) => {
      setPlayers(msg.players);
      if (msg.type === "GAME_START") {
        if (msg.totalRounds != null || msg.currentRound != null) {
          setRoundInfo({ totalRounds: msg.totalRounds, currentRound: msg.currentRound });
        }
        setScreen("game");
      }
    },
    [setPlayers, setScreen, setRoundInfo],
  );

  const ws = useWebSocket(roomId, { onRoomUpdate });

  useEffect(() => {
    const id = window.setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => window.clearInterval(id);
  }, []);

  const handleStart = () => {
    ws.sendStart();
    setScreen("game");
  };

  const emptySlotCount = Math.max(0, Math.min(maxPlayers, 3) - players.length);

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
      <ConnectionBadge status={ws.status} />
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={leaveRoom}
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
            }}
          >
            ← BACK
          </button>
          <span style={{ fontFamily: PIXEL_FONT, fontSize: "9px", color: "#1a1a1a" }}>
            WAITING ROOM
          </span>
          <span style={{ fontFamily: PIXEL_FONT, fontSize: "8px", color: "#aaa" }}>
            {players.length}/{maxPlayers}
          </span>
        </div>

        <RoomCodeShare roomCode={roomCode ?? ""} />

        {totalRounds > 1 && (
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#555",
              textAlign: "center",
              marginBottom: "16px",
              letterSpacing: "2px",
            }}
          >
            BEST OF {totalRounds}
          </div>
        )}

        <PlayerList players={players} dots={dots} emptySlotCount={emptySlotCount} />

        <StartButton onStart={handleStart} disabled={players.length < 2} isHost={isHost} />
      </div>
    </div>
  );
}
