import { fetchFromSofascore } from './sofascore.service';

const get = async (path: string, playerId: string, extraParams: any = {}) => 
  fetchFromSofascore(`/players/${path}`, { playerId, ...extraParams });

export const getDetail = (id: string, q: any) => get('detail', id, q);
export const getImage = (id: string, q: any) => get('get-image', id, q);
export const getCharacteristics = (id: string, q: any) => get('get-characteristics', id, q);
export const getRatings = (id: string, q: any) => get('get-ratings', id, q);
export const getAttributeOverviews = (id: string, q: any) => get('get-attribute-overviews', id, q);
export const getNationalTeamStatistics = (id: string, q: any) => get('get-national-team-statistics', id, q);
export const getTransferHistory = (id: string, q: any) => get('get-transfer-history', id, q);
export const getLastYearSummary = (id: string, q: any) => get('get-last-year-summary', id, q);
export const getStatisticsSeasons = (id: string, q: any) => get('get-statistics-seasons', id, q);
export const getAllStatistics = (id: string, q: any) => get('get-all-statistics', id, q);
export const getStatistics = (id: string, q: any) => get('get-statistics', id, q);
export const getLastMatches = (id: string, q: any) => get('get-last-matches', id, q);
export const getNextMatches = (id: string, q: any) => get('get-next-matches', id, q);
export const getLastRatings = (id: string, q: any) => get('get-last-ratings', id, q);
export const getMatches = (id: string, q: any) => get('get-matches', id, q);
export const searchPlayers = (name: string, q: any) => fetchFromSofascore('/players/search', { name, ...q });