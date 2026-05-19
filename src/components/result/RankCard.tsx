import { PIXEL_FONT } from "@/styles/globalStyles";
import { DinoSprite } from "@/components/sprites/DinoSprite";
import { CatSprite } from "@/components/sprites/CatSprite";

interface Props {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  animationDelay: number;
  forfeited?: boolean;
}

const RANK_LABELS = ["1ST", "2ND", "3RD"];
const RANK_COLORS = ["#f0c040", "#aaaaaa", "#cd7f32"];

export function RankCard({ rank, name, wpm, accuracy, animationDelay, forfeited = false }: Props) {
  const isFirst = rank === 1 && !forfeited;
  const label = forfeited ? "—" : (RANK_LABELS[rank - 1] ?? `${rank}TH`);
  const rankColor = forfeited ? "#888" : isFirst ? "#f0c040" : RANK_COLORS[rank - 1] ?? "#888";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px",
        background: forfeited ? "#e8e4d8" : isFirst ? "#1a1a1a" : "#fff",
        border: `3px solid ${forfeited ? "#bbb" : "#1a1a1a"}`,
        boxShadow: forfeited ? "none" : isFirst ? "5px 5px 0px #555" : "3px 3px 0px #aaa",
        opacity: forfeited ? 0.6 : 1,
        animation: `rankReveal 0.4s ${animationDelay}s ease both`,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "10px",
          color: rankColor,
          minWidth: "36px",
          textShadow: isFirst ? "2px 2px 0px #000" : "none",
        }}
      >
        {label}
      </div>

      {isFirst ? <DinoSprite size={32} animate /> : <CatSprite size={28} />}

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: PIXEL_FONT,
            fontSize: "9px",
            color: forfeited ? "#999" : isFirst ? "#f0ece0" : "#1a1a1a",
            marginBottom: "4px",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: PIXEL_FONT,
            fontSize: "7px",
            color: forfeited ? "#bbb" : isFirst ? "#888" : "#aaa",
          }}
        >
          {forfeited ? "FORFEITED" : `${accuracy}% accuracy`}
        </div>
      </div>

      {!forfeited && (
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "16px",
              color: isFirst ? "#f0c040" : "#1a1a1a",
            }}
          >
            {wpm}
          </div>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "6px",
              color: isFirst ? "#888" : "#aaa",
            }}
          >
            WPM
          </div>
        </div>
      )}
    </div>
  );
}
