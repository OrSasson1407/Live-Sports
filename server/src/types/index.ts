export interface GameTick {
  gameId: string;
  sport: 'basketball' | 'soccer';
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  clock: string; // e.g., "10:23 Q3" or "45:00 1H"
  status: 'pregame' | 'live' | 'halftime' | 'finished';
}

// Update the alert rule to match sports
export interface AlertRule {
  id: string;
  gameId: string;
  condition: 'score_above' | 'game_start' | 'game_end';
  threshold?: number; // e.g., Alert me if total score goes above 200
  isActive: boolean;
}

export interface ClientMessage {
  action: 'subscribe' | 'unsubscribe';
  gameId?: string; // Swapped from 'symbol' to 'gameId'
}