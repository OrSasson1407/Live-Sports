import { Request, Response } from 'express';
import * as tournamentsService from '../services/tournaments.service';

const handleTournamentRequest = (serviceFn: Function, requireId: boolean = true) => async (req: Request, res: Response) => {
  try {
    const { tournamentId, name, ...rest } = req.query;
    if (requireId && !tournamentId) return res.status(400).json({ error: 'tournamentId is required' });
    
    const data = requireId ? await serviceFn(tournamentId as string, rest) : await serviceFn(name as string, rest);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Tournaments API Error', details: error.message });
  }
};

export const getList = async (req: Request, res: Response) => {
  try { res.json(await tournamentsService.getList(req.query)); } 
  catch (error: any) { res.status(500).json({ error: error.message }); }
};

export const getDetail = handleTournamentRequest(tournamentsService.getDetail);
export const getLogo = handleTournamentRequest(tournamentsService.getLogo);
export const getTrendingEvents = handleTournamentRequest(tournamentsService.getTrendingEvents);
export const getFeaturedEvents = handleTournamentRequest(tournamentsService.getFeaturedEvents);
export const getScheduledEvents = handleTournamentRequest(tournamentsService.getScheduledEvents);
export const getLiveEvents = handleTournamentRequest(tournamentsService.getLiveEvents);
export const getSeasons = handleTournamentRequest(tournamentsService.getSeasons);
export const getTopPlayers = handleTournamentRequest(tournamentsService.getTopPlayers);
export const getTopTeams = handleTournamentRequest(tournamentsService.getTopTeams);
export const getRounds = handleTournamentRequest(tournamentsService.getRounds);
export const getTotwRounds = handleTournamentRequest(tournamentsService.getTotwRounds);
export const getTotw = handleTournamentRequest(tournamentsService.getTotw);
export const getPlayerStatistics = handleTournamentRequest(tournamentsService.getPlayerStatistics);
export const getStandings = handleTournamentRequest(tournamentsService.getStandings);
export const getMedia = handleTournamentRequest(tournamentsService.getMedia);
export const getCuptrees = handleTournamentRequest(tournamentsService.getCuptrees);
export const getLastMatches = handleTournamentRequest(tournamentsService.getLastMatches);
export const getNextMatches = handleTournamentRequest(tournamentsService.getNextMatches);
export const getMatches = handleTournamentRequest(tournamentsService.getMatches);
export const searchTournaments = handleTournamentRequest(tournamentsService.searchTournaments, false);