import { fetchFromSofascore } from './sofascore.service';

const get = async (path: string, tournamentId: string, extraParams: any = {}) => 
  fetchFromSofascore(`/tournaments/${path}`, { tournamentId, ...extraParams });

export const getList = (q: any) => fetchFromSofascore('/tournaments/list', q); // Often takes Category ID, not Tournament ID
export const getDetail = (id: string, q: any) => get('detail', id, q);
export const getLogo = (id: string, q: any) => get('get-logo', id, q);
export const getTrendingEvents = (id: string, q: any) => get('get-trending-events', id, q);
export const getFeaturedEvents = (id: string, q: any) => get('get-featured-events', id, q);
export const getScheduledEvents = (id: string, q: any) => get('get-scheduled-events', id, q);
export const getLiveEvents = (id: string, q: any) => get('get-live-events', id, q);
export const getSeasons = (id: string, q: any) => get('get-seasons', id, q);
export const getTopPlayers = (id: string, q: any) => get('get-top-players', id, q);
export const getTopTeams = (id: string, q: any) => get('get-top-teams', id, q);
export const getRounds = (id: string, q: any) => get('get-rounds', id, q);
export const getTotwRounds = (id: string, q: any) => get('get-team-of-the-week-rounds', id, q);
export const getTotw = (id: string, q: any) => get('get-team-of-the-week', id, q);
export const getPlayerStatistics = (id: string, q: any) => get('get-player-statistics', id, q);
export const getStandings = (id: string, q: any) => get('get-standings', id, q);
export const getMedia = (id: string, q: any) => get('get-media', id, q);
export const getCuptrees = (id: string, q: any) => get('get-cuptrees', id, q);
export const getLastMatches = (id: string, q: any) => get('get-last-matches', id, q);
export const getNextMatches = (id: string, q: any) => get('get-next-matches', id, q);
export const getMatches = (id: string, q: any) => get('get-matches', id, q);
export const searchTournaments = (name: string, q: any) => fetchFromSofascore('/tournaments/search', { name, ...q });