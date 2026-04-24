import { PIXEL_FONT } from "@/styles/globalStyles";
import { DinoSprite } from "@/components/sprites/DinoSprite";

interface Props {
  progress: number;
  animate: boolean;
  label?: string;
}

export function ProgressBar({ progress, animate, label = "YOU" }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
      <DinoSprite size={24} animate={animate} />
      <span style={{ fontFamily: PIXEL_FONT, fontSize: "8px", color: "#f0ece0", minWidth: "40px" }}>
        {label}
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
            width: `${progress}%`,
            background: "#f0ece0",
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "8px",
          color: "#f0ece0",
          minWidth: "36px",
          textAlign: "right",
        }}
      >
        {progress}%
      </span>
    </div>
  );
}
