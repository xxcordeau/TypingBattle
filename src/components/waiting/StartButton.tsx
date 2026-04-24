import { PIXEL_FONT } from "@/styles/globalStyles";
import { PixelButton } from "@/components/common/PixelButton";

interface Props {
  onStart: () => void;
  disabled: boolean;
  isHost: boolean;
}

export function StartButton({ onStart, disabled, isHost }: Props) {
  return (
    <>
      <PixelButton
        style={{ width: "100%", fontSize: "12px", padding: "16px" }}
        onClick={onStart}
        disabled={disabled || !isHost}
      >
        ▶ START GAME
      </PixelButton>
      <div
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: "7px",
          color: "#aaa",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        * host only · min 2 players
      </div>
    </>
  );
}
