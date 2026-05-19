import { forwardRef } from "react";
import type { ChangeEvent } from "react";

interface Props {
  text: string;
  input: string;
  composing: boolean;
  shakeIndex: number | null;
  started: boolean;
  lang?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: (value: string) => void;
}

const CHAR_STYLE: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "17px",
  fontWeight: "bold",
  letterSpacing: "0px",
  lineHeight: "1.8",
  textAlign: "center",
  width: "14px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const TypingArea = forwardRef<HTMLTextAreaElement, Props>(function TypingArea(
  { text, input, composing, shakeIndex, started, lang, onChange, onCompositionStart, onCompositionEnd },
  ref
) {
  const handleClick = () => {
    if (ref && "current" in ref && ref.current) {
      ref.current.focus();
    }
  };

  const composingIdx = composing && input.length > 0 ? input.length - 1 : -1;

  const pairs = text.split("").map((char, i) => {
    const isSpace = char === " ";
    const isComposing = i === composingIdx;
    const isCursor = i === input.length;

    // --- ref char (top) ---
    let refColor = "#999";
    if (i < input.length) {
      refColor = "#666";
    }

    // --- input char (bottom) ---
    let displayChar = "";
    let inputColor = "transparent";
    let bg = "transparent";

    if (i < input.length) {
      const typed = input[i];
      displayChar = typed === " " ? " " : typed;

      if (isComposing) {
        inputColor = "#e8c840";
        bg = "rgba(232,200,64,0.08)";
      } else if (typed === char) {
        inputColor = "#00aa00";
      } else {
        inputColor = "#cc2200";
        bg = "rgba(204,34,0,0.08)";
      }
    } else {
      displayChar = isSpace ? " " : "_";
      inputColor = isCursor ? "#f0ece0" : "#555";
    }

    const spaceWidth = isSpace ? "10px" : undefined;

    return (
      <div key={i} style={{ display: "inline-flex", flexDirection: "column", width: spaceWidth }}>
        <span style={{ ...CHAR_STYLE, color: refColor, width: spaceWidth }}>
          {isSpace ? " " : char}
        </span>
        <span
          style={{
            ...CHAR_STYLE,
            color: inputColor,
            background: bg,
            width: spaceWidth,
            animation: shakeIndex === i
              ? "shake 0.4s ease"
              : isCursor
                ? "blink 1s step-end infinite"
                : "none",
            borderBottom: isComposing
              ? "2px solid #e8c840"
              : isCursor
                ? "2px solid #f0ece0"
                : "2px solid transparent",
          }}
        >
          {displayChar}
        </span>
      </div>
    );
  });

  return (
    <div style={{ position: "relative" }} onClick={handleClick}>
      <div
        style={{
          background: "#1a1a1a",
          border: `3px solid ${started ? "#f0ece0" : "#444"}`,
          padding: "16px 20px",
          cursor: "text",
          transition: "border-color 0.2s",
          display: "flex",
          flexWrap: "wrap",
          minHeight: "80px",
        }}
      >
        {pairs}
        {!started && (
          <div
            style={{
              width: "100%",
              fontFamily: "'Courier New', monospace",
              fontSize: "14px",
              color: "#555",
              marginTop: "8px",
            }}
          >
            waiting to start...
          </div>
        )}
      </div>
      <textarea
        ref={ref}
        value={input}
        lang={lang}
        onChange={onChange}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={(e) => onCompositionEnd(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
            e.preventDefault();
          }
        }}
        onSelect={(e) => {
          const el = e.currentTarget;
          if (el.selectionStart !== el.value.length || el.selectionEnd !== el.value.length) {
            el.selectionStart = el.selectionEnd = el.value.length;
          }
        }}
        onPaste={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        disabled={!started}
        style={{
          position: "absolute",
          opacity: 0,
          width: "1px",
          height: "1px",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
});
