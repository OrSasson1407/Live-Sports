import { Request, Response } from 'express';
import * as teamsService from '../services/teams.service';

// Helper to avoid writing try/catch 20 times
const handleTeamRequest = (serviceFn: Function, requireId: boolean = true) => async (req: Request, res: Response) => {
  try {
    const { teamId, name, ...rest } = req.query;
    if (requireId && !teamId) return res.status(400).json({ error: 'teamId is required' });
    
    const data = requireId ? await serviceFn(teamId as string, rest) : await serviceFn(name as string, rest);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Teams API Error', details: error.message });
  }
};

export const getDetail = handleTeamRequest(teamsService.getDetail);
export const getLogo = handleTeamRequest(teamsService.getLogo);
export const getPerformance = handleTeamRequest(teamsService.getPerformance);
export const getTransfers = handleTeamRequest(teamsService.getTransfers);
export const getSquad = handleTeamRequest(teamsService.getSquad);
export const getRankings = handleTeamRequest(teamsService.getRankings);
export const getTournaments = handleTeamRequest(teamsService.getTournaments);
export const getNearEvents = handleTeamRequest(teamsService.getNearEvents);
export const getStatisticsSeasons = handleTeamRequest(teamsService.getStatisticsSeasons);
export const getRanks = handleTeamRequest(teamsService.getRanks);
export const getStatistics = handleTeamRequest(teamsService.getStatistics);
export const getPlayerStatisticsSeasons = handleTeamRequest(teamsService.getPlayerStatisticsSeasons);
export const getPlayerStatistics = handleTeamRequest(teamsService.getPlayerStatistics);
export const getLastMatches = handleTeamRequest(teamsService.getLastMatches);
export const getNextMatches = handleTeamRequest(teamsService.getNextMatches);
export const getDriverCareerHistory = handleTeamRequest(teamsService.getDriverCareerHistory);
export const getStageSeasons = handleTeamRequest(teamsService.getStageSeasons);
export const getStageSeasonRaces = handleTeamRequest(teamsService.getStageSeasonRaces);
export const getMatches = handleTeamRequest(teamsService.getMatches);
export const searchTeams = handleTeamRequest(teamsService.searchTeams, false); // requires 'name', not 'teamId'