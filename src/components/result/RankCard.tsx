import { PIXEL_FONT } from "@/styles/globalStyles";
import { DinoSprite } from "@/components/sprites/DinoSprite";
import { CatSprite } from "@/components/sprites/CatSprite";

interface Props {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  animationDelay: number;
}

const RANK_LABELS = ["1ST", "2ND", "3RD"];
const RANK_COLORS = ["#f0c040", "#aaaaaa", "#cd7f32"];

export function RankCard({ rank, name, wpm, accuracy, animationDelay }: Props) {
  const isFirst = rank === 1;
  const label = RANK_LABELS[rank - 1] ?? `${rank}TH`;
  const rankColor = isFirst ? "#f0c040" : RANK_COLORS[rank - 1] ?? "#888";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px",
        background: isFirst ? "#1a1a1a" : "#fff",
        border: "3px solid #1a1a1a",
        boxShadow: isFirst ? "5px 5px 0px #555" : "3px 3px 0px #aaa",
        animation: `rankReveal 0.4s ${animationDelay}s ease both`,
        opacity: 0,
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

      {isFirst ? <DinoSprite size={32} animate color="#f0ece0" /> : <CatSprite size={28} />}

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: PIXEL_FONT,
            fontSize: "9px",
            color: isFirst ? "#f0ece0" : "#1a1a1a",
            marginBottom: "4px",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: PIXEL_FONT,
            fontSize: "7px",
            color: isFirst ? "#888" : "#aaa",
          }}
        >
          {accuracy}% accuracy
        </div>
      </div>

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
    </div>
  );
}
