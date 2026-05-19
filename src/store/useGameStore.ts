import { create } from "zustand";
import type { GameResult, PlayerResponse, Screen, TextType } from "@/types";
import { MOCK_PLAYERS } from "@/constants/mockData";
import { pickRandomText } from "@/constants/texts";
import { generateRoomCode } from "@/constants/mockData";

interface GameState {
  // 네비게이션
  screen: Screen;
  setScreen: (s: Screen) => void;

  // 플레이어
  nickname: string;
  playerId: string | null;
  setNickname: (n: string) => void;

  // 방
  roomId: string | null;
  roomCode: string | null;
  isHost: boolean;
  maxPlayers: number;
  textType: TextType;
  text: string;
  players: PlayerResponse[];

  createRoom: (nickname: string, textType: TextType, customText?: string) => void;
  joinRoom: (nickname: string, roomCode: string) => void;
  leaveRoom: () => void;

  // 기권
  forfeited: boolean;
  forfeit: () => void;

  // 결과
  myResult: { wpm: number; accuracy: number } | null;
  results: GameResult[];
  setMyResult: (r: { wpm: number; accuracy: number }) => void;
  setResults: (r: GameResult[]) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: "home",
  setScreen: (screen) => set({ screen }),

  nickname: "",
  playerId: null,
  setNickname: (nickname) => set({ nickname }),

  roomId: null,
  roomCode: null,
  isHost: false,
  maxPlayers: 8,
  textType: "korean",
  text: "",
  players: [],

  createRoom: (nickname, textType, customText) => {
    const code = generateRoomCode();
    const text = pickRandomText(textType, customText);
    const myId = "me";
    set({
      nickname,
      playerId: myId,
      roomId: code,
      roomCode: code,
      isHost: true,
      textType,
      text,
      players: [
        { playerId: myId, playerName: nickname, isHost: true },
        ...MOCK_PLAYERS.filter((p) => !p.isHost),
      ],
      screen: "waiting",
    });
  },

  joinRoom: (nickname, roomCode) => {
    const text = pickRandomText("korean");
    const myId = "me";
    set({
      nickname,
      playerId: myId,
      roomId: roomCode,
      roomCode,
      isHost: false,
      text,
      players: [
        ...MOCK_PLAYERS,
        { playerId: myId, playerName: nickname, isHost: false },
      ],
      screen: "waiting",
    });
  },

  leaveRoom: () =>
    set({
      roomId: null,
      roomCode: null,
      isHost: false,
      players: [],
      text: "",
      myResult: null,
      results: [],
      forfeited: false,
      screen: "home",
    }),

  forfeited: false,
  forfeit: () => set({ forfeited: true }),

  myResult: null,
  results: [],
  setMyResult: (myResult) => set({ myResult }),
  setResults: (results) => set({ results }),
  resetGame: () => set({ myResult: null, results: [], forfeited: false }),
}));
