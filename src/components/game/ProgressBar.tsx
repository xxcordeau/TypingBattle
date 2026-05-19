import { PIXEL_FONT } from "@/styles/globalStyles";
import { DinoSprite } from "@/components/sprites/DinoSprite";

interface Props {
  progress: number;
  animate: boolean;
  label?: string;
  forfeited?: boolean;
}

export function ProgressBar({ progress, animate, label = "YOU", forfeited = false }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px",
        opacity: forfeited ? 0.35 : 1,
        transition: "opacity 0.3s",
      }}
    >
      <DinoSprite size={24} animate={!forfeited && animate} />
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
            background: forfeited ? "#666" : "#f0ece0",
            transition: "width 0.1s linear",
          }}
        />
        {forfeited && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: PIXEL_FONT,
              fontSize: "7px",
              color: "#f0ece0",
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
