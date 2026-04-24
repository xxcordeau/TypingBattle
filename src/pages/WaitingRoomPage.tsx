import { useEffect, useState } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";
import { useRoom } from "@/hooks/useRoom";
import { useWebSocket } from "@/hooks/useWebSocket";
import { PlayerList } from "@/components/waiting/PlayerList";
import { RoomCodeShare } from "@/components/waiting/RoomCodeShare";
import { StartButton } from "@/components/waiting/StartButton";

export function WaitingRoomPage() {
  const { roomId, roomCode, players, isHost, maxPlayers, leaveRoom } = useRoom();
  const setScreen = useGameStore((s) => s.setScreen);
  const [dots, setDots] = useState("");

  const ws = useWebSocket(roomId, {
    onRoomUpdate: () => {
      // TODO: 서버 연동 시 players 상태 갱신
    },
  });

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

        <PlayerList players={players} dots={dots} emptySlotCount={emptySlotCount} />

        <StartButton onStart={handleStart} disabled={players.length < 2} isHost={isHost} />
      </div>
    </div>
  );
}
