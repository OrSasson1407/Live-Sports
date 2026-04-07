import { fetchFromSofascore } from './sofascore.service';

const get = async (path: string, teamId: string, extraParams: any = {}) => 
  fetchFromSofascore(`/teams/${path}`, { teamId, ...extraParams });

export const getDetail = (id: string, q: any) => get('detail', id, q);
export const getLogo = (id: string, q: any) => get('get-logo', id, q);
export const getPerformance = (id: string, q: any) => get('get-performance', id, q);
export const getTransfers = (id: string, q: any) => get('get-transfers', id, q);
export const getSquad = (id: string, q: any) => get('get-squad', id, q);
export const getRankings = (id: string, q: any) => get('get-rankings', id, q);
export const getTournaments = (id: string, q: any) => get('get-tournaments', id, q);
export const getNearEvents = (id: string, q: any) => get('get-near-events', id, q);
export const getStatisticsSeasons = (id: string, q: any) => get('get-statistics-seasons', id, q);
export const getRanks = (id: string, q: any) => get('get-ranks', id, q);
export const getStatistics = (id: string, q: any) => get('get-statistics', id, q);
export const getPlayerStatisticsSeasons = (id: string, q: any) => get('get-player-statistics-seasons', id, q);
export const getPlayerStatistics = (id: string, q: any) => get('get-player-statistics', id, q);
export const getLastMatches = (id: string, q: any) => get('get-last-matches', id, q);
export const getNextMatches = (id: string, q: any) => get('get-next-matches', id, q);
export const getDriverCareerHistory = (id: string, q: any) => get('get-driver-career-history', id, q);
export const getStageSeasons = (id: string, q: any) => get('get-stage-seasons', id, q);
export const getStageSeasonRaces = (id: string, q: any) => get('get-stage-season-races', id, q);
// Deprecated
export const getMatches = (id: string, q: any) => get('get-matches', id, q);
export const searchTeams = (name: string, q: any) => fetchFromSofascore('/teams/search', { name, ...q });