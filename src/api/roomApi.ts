import type {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  ResultResponse,
} from "@/types";
import client, { useMock } from "./client";
import { mockCreateRoom, mockJoinRoom, mockFetchResult } from "./mockApi";

export async function createRoom(req: CreateRoomRequest): Promise<CreateRoomResponse> {
  if (useMock()) return mockCreateRoom(req);
  const { data } = await client.post<CreateRoomResponse>("/rooms", req);
  return data;
}

export async function joinRoom(
  roomCode: string,
  req: JoinRoomRequest,
): Promise<JoinRoomResponse> {
  if (useMock()) return mockJoinRoom(roomCode, req);
  const { data } = await client.post<JoinRoomResponse>(`/rooms/${roomCode}/join`, req);
  return data;
}

export async function leaveRoom(roomCode: string, playerId: string): Promise<void> {
  if (useMock()) return;
  await client.delete(`/rooms/${roomCode}/leave`, { data: { playerId } });
}

export async function fetchResult(roomId: string): Promise<ResultResponse> {
  if (useMock()) return mockFetchResult(roomId);
  const { data } = await client.get<ResultResponse>(`/rooms/${roomId}/result`);
  return data;
}
