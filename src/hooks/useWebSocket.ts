import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useMock } from "@/api/client";
import { MOCK_PLAYERS } from "@/constants/mockData";
import { useGameStore } from "@/store/useGameStore";
import type {
  FinishPayload,
  GameTopicMessage,
  ProgressPayload,
  ResultTopicMessage,
  RoomTopicMessage,
} from "@/types";

type Handlers = {
  onRoomUpdate?: (msg: RoomTopicMessage) => void;
  onGameUpdate?: (msg: GameTopicMessage) => void;
  onResult?: (msg: ResultTopicMessage) => void;
};

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

export interface UseWebSocketResult {
  status: ConnectionStatus;
  sendStart: () => void;
  sendProgress: (payload: ProgressPayload) => void;
  sendFinish: (payload: FinishPayload) => void;
}

export function useWebSocket(
  roomId: string | null,
  handlers: Handlers = {},
): UseWebSocketResult {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const clientRef = useRef<Client | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  useEffect(() => {
    if (!roomId) return;

    if (useMock()) {
      if (import.meta.env.DEV) {
        console.debug("[useWebSocket] (mock) subscribed to room", roomId);
      }
      setStatus("connected");

      const mockPlayers = MOCK_PLAYERS.filter((p) => !p.isHost);
      const timers: number[] = [];

      mockPlayers.forEach((mp, i) => {
        const id = window.setTimeout(() => {
          const updated = [...useGameStore.getState().players, mp];
          handlersRef.current.onRoomUpdate?.({
            type: "PLAYER_JOINED",
            players: updated,
          });
        }, 1000 + i * 800);
        timers.push(id);
      });

      return () => {
        timers.forEach((id) => window.clearTimeout(id));
        if (import.meta.env.DEV) {
          console.debug("[useWebSocket] (mock) unsubscribed");
        }
        setStatus("disconnected");
      };
    }

    const brokerURL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080/ws";

    const stompClient = new Client({
      brokerURL,
      reconnectDelay: 5000,
      onConnect: () => {
        setStatus("connected");

        stompClient.subscribe(`/topic/room/${roomId}`, (frame) => {
          handlersRef.current.onRoomUpdate?.(JSON.parse(frame.body));
        });

        stompClient.subscribe(`/topic/game/${roomId}`, (frame) => {
          handlersRef.current.onGameUpdate?.(JSON.parse(frame.body));
        });

        stompClient.subscribe(`/topic/result/${roomId}`, (frame) => {
          handlersRef.current.onResult?.(JSON.parse(frame.body));
        });
      },
      onStompError: (frame) => {
        console.error("[useWebSocket] STOMP error", frame.headers["message"]);
        setStatus("disconnected");
      },
      onWebSocketClose: () => {
        setStatus("disconnected");
      },
    });

    setStatus("connecting");
    clientRef.current = stompClient;
    stompClient.activate();

    return () => {
      stompClient.deactivate();
      clientRef.current = null;
      setStatus("disconnected");
    };
  }, [roomId]);

  const sendStart = useCallback(() => {
    if (useMock()) {
      if (import.meta.env.DEV) console.debug("[ws] sendStart", roomId);
      return;
    }
    clientRef.current?.publish({ destination: `/app/room/${roomId}/start` });
  }, [roomId]);

  const sendProgress = useCallback(
    (payload: ProgressPayload) => {
      if (useMock()) {
        if (import.meta.env.DEV) console.debug("[ws] sendProgress", payload);
        return;
      }
      clientRef.current?.publish({
        destination: `/app/game/${roomId}/progress`,
        body: JSON.stringify(payload),
      });
    },
    [roomId],
  );

  const sendFinish = useCallback(
    (payload: FinishPayload) => {
      if (useMock()) {
        if (import.meta.env.DEV) console.debug("[ws] sendFinish", payload);
        return;
      }
      clientRef.current?.publish({
        destination: `/app/game/${roomId}/finish`,
        body: JSON.stringify(payload),
      });
    },
    [roomId],
  );

  return { status, sendStart, sendProgress, sendFinish };
}
