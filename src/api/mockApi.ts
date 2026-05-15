import type {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  ResultResponse,
} from "@/types";
import { pickRandomText } from "@/constants/texts";
import { MOCK_PLAYERS, MOCK_RESULTS, generateRoomCode } from "@/constants/mockData";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockCreateRoom(req: CreateRoomRequest): Promise<CreateRoomResponse> {
  await delay(150);
  const roomCode = generateRoomCode();
  return {
    roomId: roomCode,
    roomCode,
    hostId: "me",
    text: pickRandomText(req.textType, req.customText),
    maxPlayers: req.maxPlayers,
    totalRounds: req.totalRounds ?? 1,
    status: "waiting",
  };
}

export async function mockJoinRoom(
  roomCode: string,
  req: JoinRoomRequest,
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

export async function mockFetchResult(roomId: string): Promise<ResultResponse> {
  await delay(100);
  return { roomId, results: MOCK_RESULTS };
}
