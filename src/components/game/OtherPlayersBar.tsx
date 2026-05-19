import type { GamePlayer } from "@/types";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { CatSprite } from "@/components/sprites/CatSprite";

interface Props {
  players: GamePlayer[];
}

export function OtherPlayersBar({ players }: Props) {
  return (
    <>
      {players.map((p) => {
        const dimmed = p.forfeited;
        return (
          <div
            key={p.playerId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
              opacity: dimmed ? 0.35 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <CatSprite size={24} color="#aaa" eyeColor="#1a1a1a" />
            <span
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "8px",
                color: "#aaa",
                minWidth: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {p.playerName}
            </span>
            <div
              style={{
                flex: 1,
                height: "16px",
                background: "#333",
                border: "2px solid #555",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${p.progress}%`,
                  background: dimmed ? "#555" : "#999",
                  transition: "width 0.3s linear",
                }}
              />
              {dimmed && (
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontFamily: PIXEL_FONT,
                    fontSize: "7px",
                    color: "#ccc",
                    letterSpacing: "2px",
                  }}
                >
                  FORFEIT
                </span>
              )}
            </div>
            <span
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "8px",
                color: "#aaa",
                minWidth: "36px",
                textAlign: "right",
              }}
            >
              {Math.round(p.progress)}%
            </span>
          </div>
        );
      })}
    </>
  );
}
