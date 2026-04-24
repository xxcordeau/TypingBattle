import type { ChangeEvent, CSSProperties } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: CSSProperties;
}

export function PixelInput({ value, onChange, placeholder, style = {} }: Props) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        fontFamily: PIXEL_FONT,
        fontSize: "10px",
        background: "#f0ece0",
        border: "3px solid #1a1a1a",
        padding: "12px 14px",
        width: "100%",
        outline: "none",
        letterSpacing: "1px",
        boxShadow: "inset 2px 2px 0px #ccc8b8",
        ...style,
      }}
    />
  );
}
