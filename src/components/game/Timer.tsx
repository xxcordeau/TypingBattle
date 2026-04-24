import { PIXEL_FONT } from "@/styles/globalStyles";

interface Props {
  seconds: number;
}

function format(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function Timer({ seconds }: Props) {
  return (
    <div style={{ fontFamily: PIXEL_FONT, fontSize: "9px", color: "#f0ece0" }}>
      ⏱ {format(seconds)}
    </div>
  );
}
