import type { GameResult, PlayerResponse } from "@/types";

export const MOCK_PLAYERS: PlayerResponse[] = [
  { playerId: "1", playerName: "JEONGYEON", isHost: true },
  { playerId: "2", playerName: "PIXEL_CAT", isHost: false },
  { playerId: "3", playerName: "DINO99", isHost: false },
];

export const MOCK_RESULTS: GameResult[] = [
  { rank: 1, playerId: "1", playerName: "JEONGYEON", wpm: 87, accuracy: 96, finishedAt: null },
  { rank: 2, playerId: "3", playerName: "DINO99", wpm: 74, accuracy: 91, finishedAt: null },
  { rank: 3, playerId: "2", playerName: "PIXEL_CAT", wpm: 61, accuracy: 88, finishedAt: null },
];

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
