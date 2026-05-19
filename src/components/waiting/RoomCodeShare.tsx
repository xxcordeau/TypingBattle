import { useState } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { PixelBox } from "@/components/common/PixelBox";
import { PixelButton } from "@/components/common/PixelButton";

interface Props {
  roomCode: string;
}

export function RoomCodeShare({ roomCode }: Props) {
  const [copiedType, setCopiedType] = useState<"code" | "link" | null>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
    } catch {}
    setCopiedType("code");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}?code=${roomCode}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {}
    setCopiedType("link");
    setTimeout(() => setCopiedType(null), 2000);
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
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "14px" }}>
        <PixelButton
          variant="secondary"
          style={{ fontSize: "8px" }}
          onClick={handleCopyCode}
        >
          {copiedType === "code" ? "✓ COPIED!" : "COPY CODE"}
        </PixelButton>
        <PixelButton
          variant="secondary"
          style={{ fontSize: "8px" }}
          onClick={handleCopyLink}
        >
          {copiedType === "link" ? "✓ COPIED!" : "COPY LINK"}
        </PixelButton>
      </div>
    </PixelBox>
  );
}
