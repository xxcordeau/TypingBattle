import { PIXEL_FONT } from "@/styles/globalStyles";
import { PixelInput } from "@/components/common/PixelInput";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function NicknameInput({ value, onChange }: Props) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "8px",
          color: "#555",
          display: "block",
          marginBottom: "8px",
        }}
      >
        PLAYER NAME
      </label>
      <PixelInput
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 12))}
        placeholder="enter nickname..."
      />
      <div
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "7px",
          color: "#aaa",
          marginTop: "6px",
          textAlign: "right",
        }}
      >
        {value.length}/12
      </div>
    </div>
  );
}
