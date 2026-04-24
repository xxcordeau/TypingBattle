import { useState } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { PixelBox } from "@/components/common/PixelBox";
import { PixelButton } from "@/components/common/PixelButton";

interface Props {
  roomCode: string;
}

export function RoomCodeShare({ roomCode }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
    } catch {
      // clipboard 실패해도 UI 는 동일하게
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PixelBox style={{ marginBottom: "16px", textAlign: "center", background: "#1a1a1a" }}>
      <div style={{ fontFamily: PIXEL_FONT, fontSize: "8px", color: "#888", marginBottom: "10px" }}>
        ROOM CODE
      </div>
      <div
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "28px",
          color: "#f0ece0",
          letterSpacing: "8px",
        }}
      >
        {roomCode}
      </div>
      <PixelButton
        variant="secondary"
        style={{ marginTop: "14px", fontSize: "8px" }}
        onClick={handleCopy}
      >
        {copied ? "✓ COPIED!" : "COPY CODE"}
      </PixelButton>
    </PixelBox>
  );
}
