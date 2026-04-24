import { useCallback, useEffect, useRef } from "react";
import type {
  FinishPayload,
  GameTopicMessage,
  ProgressPayload,
  ResultTopicMessage,
  RoomTopicMessage,
} from "@/types";

/**
 * STOMP WebSocket 클라이언트 훅.
 *
 * 현재는 mock 구현 (no-op). 추후 @stomp/stompjs 로 교체 예정.
 *
 * Topic:
 *   /topic/room/{roomId}    : 대기실 상태
 *   /topic/game/{roomId}    : 게임 진행 상태
 *   /topic/result/{roomId}  : 결과
 *
 * App destination:
 *   /app/room/{roomId}/start
 *   /app/game/{roomId}/progress
 *   /app/game/{roomId}/finish
 */

type Handlers = {
  onRoomUpdate?: (msg: RoomTopicMessage) => void;
  onGameUpdate?: (msg: GameTopicMessage) => void;
  onResult?: (msg: ResultTopicMessage) => void;
};

export interface UseWebSocketResult {
  connected: boolean;
  sendStart: () => void;
  sendProgress: (payload: ProgressPayload) => void;
  sendFinish: (payload: FinishPayload) => void;
}

export function useWebSocket(
  roomId: string | null,
  handlers: Handlers = {}
): UseWebSocketResult {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!roomId) return;

    // TODO: 실제 STOMP 연결
    // const client = new Client({
    //   brokerURL: import.meta.env.VITE_WS_URL ?? "ws://localhost:8080/ws",
    //   onConnect: () => {
    //     client.subscribe(`/topic/room/${roomId}`, (f) => handlersRef.current.onRoomUpdate?.(JSON.parse(f.body)));
    //     client.subscribe(`/topic/game/${roomId}`, (f) => handlersRef.current.onGameUpdate?.(JSON.parse(f.body)));
    //     client.subscribe(`/topic/result/${roomId}`, (f) => handlersRef.current.onResult?.(JSON.parse(f.body)));
    //   },
    // });
    // client.activate();
    // return () => { client.deactivate(); };

    if (import.meta.env.DEV) {
      console.debug("[useWebSocket] (mock) subscribed to room", roomId);
    }
    return () => {
      if (import.meta.env.DEV) {
        console.debug("[useWebSocket] (mock) unsubscribed");
      }
    };
  }, [roomId]);

  const sendStart = useCallback(() => {
    // client.publish({ destination: `/app/room/${roomId}/start` });
    if (import.meta.env.DEV) console.debug("[ws] sendStart", roomId);
  }, [roomId]);

  const sendProgress = useCallback(
    (payload: ProgressPayload) => {
      // client.publish({ destination: `/app/game/${roomId}/progress`, body: JSON.stringify(payload) });
      if (import.meta.env.DEV) console.debug("[ws] sendProgress", payload);
    },
    [roomId]
  );

  const sendFinish = useCallback(
    (payload: FinishPayload) => {
      // client.publish({ destination: `/app/game/${roomId}/finish`, body: JSON.stringify(payload) });
      if (import.meta.env.DEV) console.debug("[ws] sendFinish", payload);
    },
    [roomId]
  );

  return {
    connected: roomId !== null,
    sendStart,
    sendProgress,
    sendFinish,
  };
}
