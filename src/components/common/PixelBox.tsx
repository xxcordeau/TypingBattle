import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  accent?: boolean;
}

export function PixelBox({ children, style = {}, accent = false }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        border: "4px solid #1a1a1a",
        boxShadow: accent ? "6px 6px 0px #1a1a1a" : "4px 4px 0px #1a1a1a",
        padding: "20px",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
