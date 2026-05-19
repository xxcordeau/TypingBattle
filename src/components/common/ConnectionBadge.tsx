import { PIXEL_FONT } from "@/styles/globalStyles";
import type { ConnectionStatus } from "@/hooks/useWebSocket";

const STATUS_CONFIG: Record<ConnectionStatus, { color: string; label: string }> = {
  connected: { color: "#4caf50", label: "ONLINE" },
  connecting: { color: "#ff9800", label: "CONNECTING" },
  disconnected: { color: "#d32f2f", label: "OFFLINE" },
};

interface Props {
  status: ConnectionStatus;
}

export function ConnectionBadge({ status }: Props) {
  const { color, label } = STATUS_CONFIG[status];

  return (
    <div
      style={{
        position: "fixed",
        top: "8px",
        right: "8px",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: PIXEL_FONT,
        fontSize: "6px",
        color: "#888",
        background: "rgba(255,255,255,0.9)",
        border: "2px solid #ccc",
        padding: "4px 8px",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          animation: status === "connecting" ? "blink 1s step-end infinite" : undefined,
        }}
      />
      {label}
    </div>
  );
}
