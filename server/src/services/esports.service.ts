import { fetchFromSofascore } from './sofascore.service';

export const getLineups = async (matchId: string) => {
  return await fetchFromSofascore('/esport-games/get-lineups', { matchId });
};

export const getStatistics = async (matchId: string) => {
  return await fetchFromSofascore('/esport-games/get-statistics', { matchId });
};

export const getRounds = async (matchId: string) => {
  return await fetchFromSofascore('/esport-games/get-rounds', { matchId });
};

export const getBans = async (matchId: string) => {
  return await fetchFromSofascore('/esport-games/get-bans', { matchId });
};