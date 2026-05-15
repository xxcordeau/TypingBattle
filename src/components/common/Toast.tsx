import { useEffect } from "react";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";

export function Toast() {
  const error = useGameStore((s) => s.error);
  const clearError = useGameStore((s) => s.clearError);

  useEffect(() => {
    if (!error) return;
    const id = window.setTimeout(clearError, 4000);
    return () => window.clearTimeout(id);
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#d32f2f",
        color: "#fff",
        border: "3px solid #1a1a1a",
        boxShadow: "4px 4px 0px #1a1a1a",
        padding: "12px 20px",
        fontFamily: PIXEL_FONT,
        fontSize: "8px",
        letterSpacing: "1px",
        animation: "floatUp 0.3s ease",
        cursor: "pointer",
        maxWidth: "90vw",
      }}
      onClick={clearError}
    >
      {error}
    </div>
  );
}
