import { create } from 'zustand';

export interface MatchEvent {
  id: string | number;
  minute: string;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'FOUL';
  player: string;
  team: string;
  playerId?: string;
}

export interface PlayerLineup {
  id: string;
  name: string;
  number: number;
  position: string;
  isCaptain?: boolean;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
}

export interface GameTick {
  gameId: string;
  sport: 'basketball' | 'soccer';
  competition: string;          // e.g. "UEFA Europa League, Knockout stage"
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  clock: string;                // "19:30", "45'", "FT", etc.
  status: 'pregame' | 'live' | 'halftime' | 'finished';
  events?: MatchEvent[];
  homeLineup?: PlayerLineup[];
  awayLineup?: PlayerLineup[];
  stats?: MatchStats;
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
      games: { ...state.games, [game.gameId]: { ...state.games[game.gameId], ...game } },
    })),
  setGames: (games) =>
    set({ games: Object.fromEntries(games.map((g) => [g.gameId, g])) }),
}));