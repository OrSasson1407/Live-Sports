// client/src/store/useSportsStore.ts
import { create } from 'zustand';

export interface GameTick {
  gameId: string;
  sport: 'basketball' | 'soccer';
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  clock: string;
  status: 'pregame' | 'live' | 'halftime' | 'finished';
}

interface SportsState {
  isConnected: boolean;
  games: Record<string, GameTick>;
  setConnected: (status: boolean) => void;
  updateGame: (game: GameTick) => void;
  setGames: (games: GameTick[]) => void;
}

export const useSportsStore = create<SportsState>((set) => ({
  isConnected: false,
  games: {},
  setConnected: (status) => set({ isConnected: status }),
  updateGame: (game) =>
    set((state) => ({
      games: { ...state.games, [game.gameId]: game },
    })),
  setGames: (games) =>
    set({
      games: Object.fromEntries(games.map((g) => [g.gameId, g])),
    }),
}));