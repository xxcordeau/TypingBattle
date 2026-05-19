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
    // 기본: 아직 입력 안 한 글자
    let color = "#888";
    let bg = "transparent";

    if (i < input.length) {
      const correct = input[i] === char;
      color = correct ? "#7cd67c" : "#ff6b6b";
      bg = correct ? "rgba(124,214,124,0.15)" : "rgba(255,107,107,0.25)";
    }
    if (i === input.length) {
      // 커서 위치
      bg = "rgba(240,236,224,0.25)";
      color = "#f0ece0";
    }

    const isShaking = shakeIndex === i;
    const isSpace = char === " ";

    return (
      <span
        key={i}
        style={{
          color,
          background: bg,
          borderRadius: "2px",
          // shake 는 transform 이 필요해서 inline-block 으로 전환
          display: isShaking ? "inline-block" : "inline",
          animation: isShaking ? "shake 0.4s ease" : "none",
          // 공백은 배경이 보이도록 최소 너비 보장
          padding: isSpace && i === input.length ? "0 2px" : "0",
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
          background: "#0e0e0e",
          border: "3px solid #444",
          padding: "24px",
          marginBottom: "16px",
          lineHeight: "2",
          minHeight: "120px",
          maxHeight: "260px",
          overflowY: "auto",
          fontFamily: "'Courier New', 'Malgun Gothic', monospace",
          fontSize: "17px",
          letterSpacing: "0.5px",
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
          color: "#888",
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
          fontFamily: "'Courier New', 'Malgun Gothic', monospace",
          fontSize: "15px",
          width: "100%",
          background: started ? "#1a1a1a" : "#111",
          border: `3px solid ${started ? "#f0ece0" : "#444"}`,
          color: "#f0ece0",
          caretColor: "#f0c040",
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
