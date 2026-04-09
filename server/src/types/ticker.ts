// server/src/types/ticker.ts

// The new sports tick replacing the old crypto tick
export interface GameTick {
  gameId: string;
  sport: 'soccer' | 'basketball' | 'tennis' | 'hockey' | 'baseball' | 'american-football' | 'rugby' | 'volleyball' | 'handball' | string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  clock: string; 
  status: 'pregame' | 'live' | 'halftime' | 'finished';
}

// Updated AlertRule to use gameId and sports-specific conditions
export interface AlertRule {
  id: string;
  gameId: string;
  condition: 'score_above' | 'game_start' | 'game_end';
  threshold?: number; 
  isActive: boolean;
}

// Updated ClientMessage to use gameId instead of symbol
export interface ClientMessage {
  action: 'subscribe' | 'unsubscribe' | 'add_alert';
  gameId?: string; 
  payload?: any;
}