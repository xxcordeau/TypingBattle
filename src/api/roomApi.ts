import type {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  ResultResponse,
} from "@/types";
import { pickRandomText } from "@/constants/texts";
import { MOCK_PLAYERS, MOCK_RESULTS, generateRoomCode } from "@/constants/mockData";

/**
 * REST API client.
 * 현재는 mock 응답. 백엔드 준비되면 fetch/axios 로 교체.
 *
 * @example
 *   // const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
 *   // return fetch(`${BASE}/rooms`, { method: "POST", body: JSON.stringify(req) }).then(r => r.json());
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function createRoom(req: CreateRoomRequest): Promise<CreateRoomResponse> {
  await delay(150);
  const roomCode = generateRoomCode();
  return {
    roomId: roomCode,
    roomCode,
    hostId: "me",
    text: pickRandomText(req.textType, req.customText),
    maxPlayers: req.maxPlayers,
    status: "waiting",
  };
}

export async function joinRoom(
  roomCode: string,
  req: JoinRoomRequest
): Promise<JoinRoomResponse> {
  await delay(150);
  return {
    playerId: "me",
    roomId: roomCode,
    roomCode,
    text: pickRandomText("english"),
    players: [
      ...MOCK_PLAYERS,
      { playerId: "me", playerName: req.playerName, isHost: false },
    ],
  };
}

export async function fetchResult(roomId: string): Promise<ResultResponse> {
  await delay(100);
  return { roomId, results: MOCK_RESULTS };
}
