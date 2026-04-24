import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";

type Variant = "primary" | "secondary" | "danger" | "success";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  style?: CSSProperties;
  disabled?: boolean;
}

const COLORS: Record<Variant, { bg: string; text: string; shadow: string }> = {
  primary: { bg: "#1a1a1a", text: "#f0ece0", shadow: "#555" },
  secondary: { bg: "#f0ece0", text: "#1a1a1a", shadow: "#999" },
  danger: { bg: "#cc2200", text: "#fff", shadow: "#880000" },
  success: { bg: "#007700", text: "#fff", shadow: "#004400" },
};

export function PixelButton({
  children,
  onClick,
  variant = "primary",
  style = {},
  disabled = false,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const c = COLORS[variant];

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        fontFamily: PIXEL_FONT,
        fontSize: "10px",
        background: c.bg,
        color: c.text,
        border: "3px solid #1a1a1a",
        padding: "12px 20px",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: pressed ? "none" : `3px 3px 0px ${c.shadow}`,
        transform: pressed ? "translate(3px, 3px)" : "none",
        transition: "none",
        letterSpacing: "1px",
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
