import { useState } from "react";
import type { TextType } from "@/types";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { PixelButton } from "@/components/common/PixelButton";

interface Props {
  disabled: boolean;
  onSubmit: (textType: TextType, totalRounds: number, customText?: string) => void;
}

const OPTIONS: TextType[] = ["korean", "english", "custom"];
const ROUND_OPTIONS = [1, 3, 5] as const;

export function CreateRoomForm({ disabled, onSubmit }: Props) {
  const [textType, setTextType] = useState<TextType>("korean");
  const [customText, setCustomText] = useState("");
  const [totalRounds, setTotalRounds] = useState<number>(1);

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
        TEXT TYPE
      </label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {OPTIONS.map((t) => (
          <button
            key={t}
            onClick={() => setTextType(t)}
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "7px",
              padding: "8px 10px",
              background: textType === t ? "#1a1a1a" : "#f0ece0",
              color: textType === t ? "#f0ece0" : "#1a1a1a",
              border: "2px solid #1a1a1a",
              cursor: "pointer",
              flex: 1,
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <label
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "8px",
          color: "#555",
          display: "block",
          marginBottom: "8px",
        }}
      >
        ROUNDS
      </label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {ROUND_OPTIONS.map((r) => (
          <button
            key={r}
            onClick={() => setTotalRounds(r)}
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "7px",
              padding: "8px 10px",
              background: totalRounds === r ? "#1a1a1a" : "#f0ece0",
              color: totalRounds === r ? "#f0ece0" : "#1a1a1a",
              border: "2px solid #1a1a1a",
              cursor: "pointer",
              flex: 1,
            }}
          >
            {r === 1 ? "1 ROUND" : `BEST OF ${r}`}
          </button>
        ))}
      </div>

      {textType === "custom" && (
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="enter custom text..."
          rows={3}
          style={{
            fontFamily: PIXEL_FONT,
            fontSize: "9px",
            width: "100%",
            background: "#f0ece0",
            border: "3px solid #1a1a1a",
            padding: "10px",
            marginBottom: "16px",
            resize: "none",
            outline: "none",
            lineHeight: "1.6",
          }}
        />
      )}

      <PixelButton
        style={{ width: "100%", fontSize: "11px", padding: "14px" }}
        onClick={() => onSubmit(textType, totalRounds, customText)}
        disabled={disabled || (textType === "custom" && !customText.trim())}
      >
        CREATE ROOM
      </PixelButton>
    </div>
  );
}
