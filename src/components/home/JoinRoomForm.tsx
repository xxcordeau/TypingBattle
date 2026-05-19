import { useState } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { PixelButton } from "@/components/common/PixelButton";
import { PixelInput } from "@/components/common/PixelInput";

interface Props {
  disabled: boolean;
  onSubmit: (roomCode: string, spectator?: boolean) => void;
  initialCode?: string;
}

export function JoinRoomForm({ disabled, onSubmit, initialCode = "" }: Props) {
  const [roomCode, setRoomCode] = useState(initialCode);

  return (
    <div style={{ animation: "popIn 0.2s ease" }}>
      <label
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "8px",
          color: "#555",
          display: "block",
          marginBottom: "8px",
        }}
      >
        ROOM CODE
      </label>
      <PixelInput
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
        placeholder="ABC123"
        style={{
          textAlign: "center",
          fontSize: "14px",
          letterSpacing: "6px",
          marginBottom: "16px",
        }}
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <PixelButton
          style={{ flex: 1, fontSize: "11px", padding: "14px" }}
          onClick={() => onSubmit(roomCode)}
          disabled={disabled || roomCode.length !== 6}
        >
          JOIN
        </PixelButton>
        <PixelButton
          style={{
            flex: 1,
            fontSize: "11px",
            padding: "14px",
            background: "#888",
            color: "#f0ece0",
          }}
          onClick={() => onSubmit(roomCode, true)}
          disabled={disabled || roomCode.length !== 6}
        >
          SPECTATE
        </PixelButton>
      </div>
    </div>
  );
}
