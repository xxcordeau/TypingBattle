import { forwardRef } from "react";
import type { ChangeEvent } from "react";

interface Props {
  text: string;
  input: string;
  shakeIndex: number | null;
  started: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TypingArea = forwardRef<HTMLTextAreaElement, Props>(function TypingArea(
  { text, input, shakeIndex, started, onChange },
  ref
) {
  const chars = text.split("").map((char, i) => {
    let color = "#bbb";
    let bg = "transparent";
    if (i < input.length) {
      color = input[i] === char ? "#007700" : "#cc2200";
      bg = input[i] === char ? "rgba(0,119,0,0.08)" : "rgba(204,34,0,0.08)";
    }
    if (i === input.length) {
      bg = "rgba(0,0,0,0.12)";
      color = "#1a1a1a";
    }
    return (
      <span
        key={i}
        style={{
          color,
          background: bg,
          fontFamily: "'Courier New', monospace",
          fontSize: "15px",
          letterSpacing: "0.5px",
          animation: shakeIndex === i ? "shake 0.4s ease" : "none",
          display: "inline-block",
        }}
      >
        {char}
      </span>
    );
  });

  return (
    <>
      <div
        style={{
          background: "#111",
          border: "3px solid #444",
          padding: "24px",
          marginBottom: "16px",
          lineHeight: "2",
          minHeight: "120px",
        }}
      >
        {chars}
      </div>
      <textarea
        ref={ref}
        value={input}
        onChange={onChange}
        disabled={!started}
        rows={3}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "14px",
          width: "100%",
          background: started ? "#1a1a1a" : "#111",
          border: `3px solid ${started ? "#f0ece0" : "#444"}`,
          color: "#f0ece0",
          padding: "16px",
          resize: "none",
          outline: "none",
          letterSpacing: "0.5px",
          lineHeight: "1.8",
        }}
        placeholder={started ? "start typing..." : "waiting to start..."}
      />
    </>
  );
});
