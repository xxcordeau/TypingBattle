export type TextType = "korean" | "english" | "custom";

export type RoomStatus = "waiting" | "playing" | "finished";

export type Screen = "home" | "waiting" | "game" | "result";

export interface PlayerResponse {
  playerId: string;
  playerName: string;
  isHost: boolean;
  isReady?: boolean;
}

export interface GamePlayer {
  playerId: string;
  playerName: string;
  progress: number;
  isFinished: boolean;
  rank?: number;
}

export interface CreateRoomRequest {
  hostName: string;
  maxPlayers: number;
  textType: TextType;
  customText?: string;
}

export interface CreateRoomResponse {
  roomId: string;
  roomCode: string;
  hostId: string;
  text: string;
  maxPlayers: number;
  status: RoomStatus;
}

export interface JoinRoomRequest {
  playerName: string;
}

export interface JoinRoomResponse {
  playerId: string;
  roomId: string;
  roomCode: string;
  text: string;
  players: PlayerResponse[];
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
  type: "PLAYER_JOINED" | "PLAYER_LEFT" | "GAME_START";
  players: PlayerResponse[];
};

export type GameTopicMessage = {
  players: GamePlayer[];
};

export type ResultTopicMessage = {
  results: GameResult[];
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
