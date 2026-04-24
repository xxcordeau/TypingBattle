import type { GamePlayer } from "@/types";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { CatSprite } from "@/components/sprites/CatSprite";

interface Props {
  players: GamePlayer[];
}

export function OtherPlayersBar({ players }: Props) {
  return (
    <>
      {players.map((p) => (
        <div
          key={p.playerId}
          style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}
        >
          <CatSprite size={24} />
          <span
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#888",
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
              border: "2px solid #444",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${p.progress}%`,
                background: "#666",
                transition: "width 0.3s linear",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#888",
              minWidth: "36px",
              textAlign: "right",
            }}
          >
            {Math.round(p.progress)}%
          </span>
        </div>
      ))}
    </>
  );
}
