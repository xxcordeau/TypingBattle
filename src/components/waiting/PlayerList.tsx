import type { PlayerResponse } from "@/types";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { PixelBox } from "@/components/common/PixelBox";
import { DinoSprite } from "@/components/sprites/DinoSprite";

interface Props {
  players: PlayerResponse[];
  dots: string;
  emptySlotCount: number;
}

export function PlayerList({ players, dots, emptySlotCount }: Props) {
  return (
    <PixelBox accent style={{ marginBottom: "16px" }}>
      <div style={{ fontFamily: PIXEL_FONT, fontSize: "8px", color: "#555", marginBottom: "14px" }}>
        PLAYERS {dots}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {players.map((p, i) => (
          <div
            key={p.playerId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              background: p.isHost ? "#1a1a1a" : "#f8f6f0",
              border: "2px solid #1a1a1a",
              animation: `floatUp 0.3s ${i * 0.08}s ease both`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <DinoSprite size={28} animate={p.isHost} />
            <span
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "9px",
                color: p.isHost ? "#f0ece0" : "#1a1a1a",
                flex: 1,
              }}
            >
              {p.playerName}
            </span>
            {p.isHost && (
              <span
                style={{
                  fontFamily: PIXEL_FONT,
                  fontSize: "7px",
                  color: "#f0ece0",
                  background: "#555",
                  padding: "3px 6px",
                }}
              >
                HOST
              </span>
            )}
          </div>
        ))}

        {Array.from({ length: emptySlotCount }).map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              padding: "10px 12px",
              border: "2px dashed #ccc",
              textAlign: "center",
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#ccc",
            }}
          >
            waiting{dots}
          </div>
        ))}
      </div>
    </PixelBox>
  );
}
