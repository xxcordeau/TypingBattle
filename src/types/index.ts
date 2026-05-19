export type TextType = "korean" | "english" | "custom";

export type RoomStatus = "waiting" | "playing" | "finished";

export type Screen = "home" | "waiting" | "game" | "roundResult" | "result";

export interface PlayerResponse {
  playerId: string;
  playerName: string;
  isHost: boolean;
  isReady?: boolean;
  isSpectator?: boolean;
}

export interface GamePlayer {
  playerId: string;
  playerName: string;
  progress: number;
  isFinished: boolean;
  forfeited?: boolean;
  rank?: number;
}

export interface CreateRoomRequest {
  hostName: string;
  maxPlayers: number;
  textType: TextType;
  customText?: string;
  totalRounds?: number;
}

export interface CreateRoomResponse {
  roomId: string;
  roomCode: string;
  hostId: string;
  text: string;
  maxPlayers: number;
  totalRounds: number;
  status: RoomStatus;
}

export interface JoinRoomRequest {
  playerName: string;
  spectator?: boolean;
}

export interface JoinRoomResponse {
  playerId: string;
  roomId: string;
  roomCode: string;
  text: string;
  players: PlayerResponse[];
  isSpectator?: boolean;
  status?: string;
}

export interface GameResult {
  rank: number;
  playerId: string;
  playerName: string;
  wpm: number;
  accuracy: number;
  finishedAt: string | null;
}

export interface ResultResponse {
  roomId: string;
  results: GameResult[];
}

// ── WebSocket payload types ───────────────────
export type RoomTopicMessage = {
  type: "PLAYER_JOINED" | "PLAYER_LEFT" | "GAME_START" | "ROOM_CLOSED";
  players: PlayerResponse[];
  totalRounds?: number;
  currentRound?: number;
};

export type GameTopicMessage = {
  players: GamePlayer[];
  countdownSeconds?: number;
};

export type ResultTopicMessage = {
  type?: "ROUND_RESULT" | "GAME_OVER" | "NEXT_ROUND";
  currentRound?: number;
  totalRounds?: number;
  roundWinnerId?: string;
  results?: GameResult[];
  wins?: Record<string, number>;
  text?: string;
};

export interface ProgressPayload {
  playerId: string;
  progress: number;
  currentIndex: number;
}

export interface FinishPayload {
  playerId: string;
  wpm: number;
  accuracy: number;
}

export interface ForfeitPayload {
  playerId: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
