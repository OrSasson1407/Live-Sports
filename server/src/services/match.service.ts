import { fetchFromSofascore } from './sofascore.service';

// Basic Detail
export const getMatchDetail = (id: string) => fetchFromSofascore(`/event/${id}`);

// Insights & Social
export const getAiInsights = (id: string) => fetchFromSofascore(`/event/${id}/ai-insights`);
export const getComments = (id: string) => fetchFromSofascore(`/event/${id}/comments`);
export const getTweets = (id: string) => fetchFromSofascore(`/event/${id}/tweets`);
export const getMedia = (id: string) => fetchFromSofascore(`/event/${id}/media`);

// Match Data
export const getLineups = (id: string) => fetchFromSofascore(`/event/${id}/lineups`);
export const getIncidents = (id: string) => fetchFromSofascore(`/event/${id}/incidents`);
export const getStatistics = (id: string) => fetchFromSofascore(`/event/${id}/statistics`);
export const getGraph = (id: string) => fetchFromSofascore(`/event/${id}/graph`);
export const getVotes = (id: string) => fetchFromSofascore(`/event/${id}/votes`);
export const getManagers = (id: string) => fetchFromSofascore(`/event/${id}/managers`);
export const getTeamStreaks = (id: string) => fetchFromSofascore(`/event/${id}/team-streaks`);
export const getBestPlayers = (id: string) => fetchFromSofascore(`/event/${id}/best-players`);

// Player Specific
export const getPlayerStatistics = (id: string, playerId: string) => 
  fetchFromSofascore(`/event/${id}/player/${playerId}/statistics`);
export const getPlayerHeatmap = (id: string, playerId: string) => 
  fetchFromSofascore(`/event/${id}/player/${playerId}/heatmap`);

// Odds
export const getAllOdds = (id: string) => fetchFromSofascore(`/event/${id}/odds/all`);
export const getFeaturedOdds = (id: string) => fetchFromSofascore(`/event/${id}/odds/featured`);

// H2H
export const getH2HEvents = (id: string) => fetchFromSofascore(`/event/${id}/h2h/events`);
export const getH2H = (id: string) => fetchFromSofascore(`/event/${id}/h2h`);

// Esport
export const getEsportGames = (id: string) => fetchFromSofascore(`/event/${id}/esport-games`);