import { create } from "zustand";
import type { GameResult, PlayerResponse, Screen, TextType } from "@/types";
import * as roomApi from "@/api/roomApi";

interface GameState {
  screen: Screen;
  setScreen: (s: Screen) => void;

  nickname: string;
  playerId: string | null;
  setNickname: (n: string) => void;

  roomId: string | null;
  roomCode: string | null;
  isHost: boolean;
  isSpectator: boolean;
  maxPlayers: number;
  textType: TextType;
  text: string;
  players: PlayerResponse[];

  // 라운드
  totalRounds: number;
  currentRound: number;
  wins: Record<string, number>;
  roundWinnerId: string | null;

  // 비동기 상태
  isLoading: boolean;
  error: string | null;
  clearError: () => void;

  createRoom: (nickname: string, textType: TextType, totalRounds: number, customText?: string) => Promise<void>;
  joinRoom: (nickname: string, roomCode: string, spectator?: boolean) => Promise<void>;
  leaveRoom: () => void;
  setPlayers: (players: PlayerResponse[]) => void;
  setText: (text: string) => void;
  setRoundInfo: (info: { currentRound?: number; totalRounds?: number; wins?: Record<string, number>; roundWinnerId?: string }) => void;

  // 기권
  forfeited: boolean;
  forfeit: () => void;

  // 결과
  myResult: { wpm: number; accuracy: number } | null;
  results: GameResult[];
  setMyResult: (r: { wpm: number; accuracy: number }) => void;
  setResults: (r: GameResult[]) => void;
  resetGame: () => void;
  resetRound: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: "home",
  setScreen: (screen) => set({ screen }),

  nickname: "",
  playerId: null,
  setNickname: (nickname) => set({ nickname }),

  roomId: null,
  roomCode: null,
  isHost: false,
  isSpectator: false,
  maxPlayers: 8,
  textType: "korean",
  text: "",
  players: [],

  totalRounds: 1,
  currentRound: 1,
  wins: {},
  roundWinnerId: null,

  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),

  createRoom: async (nickname, textType, totalRounds, customText) => {
    set({ isLoading: true, error: null });
    try {
      const res = await roomApi.createRoom({
        hostName: nickname,
        maxPlayers: get().maxPlayers,
        textType,
        customText,
        totalRounds,
      });
      set({
        nickname,
        playerId: res.hostId,
        roomId: res.roomId,
        roomCode: res.roomCode,
        isHost: true,
        textType,
        text: res.text,
        maxPlayers: res.maxPlayers,
        totalRounds: res.totalRounds ?? totalRounds,
        currentRound: 1,
        wins: {},
        players: [{ playerId: res.hostId, playerName: nickname, isHost: true }],
        screen: "waiting",
        isLoading: false,
      });
    } catch (e: unknown) {
      const msg = (e as { message?: string }).message ?? "Failed to create room";
      set({ isLoading: false, error: msg });
    }
  },

  joinRoom: async (nickname, roomCode, spectator) => {
    set({ isLoading: true, error: null });
    try {
      const res = await roomApi.joinRoom(roomCode, { playerName: nickname, spectator });
      const isSpectator = res.isSpectator ?? false;
      const screen = res.status === "playing" ? "game" : "waiting";
      set({
        nickname,
        playerId: res.playerId,
        roomId: res.roomId,
        roomCode: res.roomCode,
        isHost: false,
        isSpectator,
        text: res.text,
        players: res.players,
        screen,
        isLoading: false,
      });
    } catch (e: unknown) {
      const msg = (e as { message?: string }).message ?? "Failed to join room";
      set({ isLoading: false, error: msg });
    }
  },

  leaveRoom: () => {
    const { roomCode, playerId } = get();
    if (roomCode && playerId) {
      roomApi.leaveRoom(roomCode, playerId).catch(() => {});
    }
    set({
      roomId: null,
      roomCode: null,
      isHost: false,
      isSpectator: false,
      players: [],
      text: "",
      myResult: null,
      results: [],
      totalRounds: 1,
      currentRound: 1,
      wins: {},
      roundWinnerId: null,
      forfeited: false,
      screen: "home",
    });
  },

  forfeited: false,
  forfeit: () => set({ forfeited: true }),

  setPlayers: (players) => set({ players }),
  setText: (text) => set({ text }),
  setRoundInfo: (info) =>
    set((s) => ({
      currentRound: info.currentRound ?? s.currentRound,
      totalRounds: info.totalRounds ?? s.totalRounds,
      wins: info.wins ?? s.wins,
      roundWinnerId: info.roundWinnerId ?? s.roundWinnerId,
    })),

  myResult: null,
  results: [],
  setMyResult: (myResult) => set({ myResult }),
  setResults: (results) => set({ results }),
  resetGame: () => set({ myResult: null, results: [], currentRound: 1, wins: {}, roundWinnerId: null, forfeited: false }),
  resetRound: () => set({ myResult: null, results: [], roundWinnerId: null, forfeited: false }),
}));
