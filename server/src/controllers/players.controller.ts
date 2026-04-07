import { Request, Response } from 'express';
import * as playersService from '../services/players.service';

const handlePlayerRequest = (serviceFn: Function, requireId: boolean = true) => async (req: Request, res: Response) => {
  try {
    const { playerId, name, ...rest } = req.query;
    if (requireId && !playerId) return res.status(400).json({ error: 'playerId is required' });
    
    const data = requireId ? await serviceFn(playerId as string, rest) : await serviceFn(name as string, rest);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Players API Error', details: error.message });
  }
};

export const getDetail = handlePlayerRequest(playersService.getDetail);
export const getImage = handlePlayerRequest(playersService.getImage);
export const getCharacteristics = handlePlayerRequest(playersService.getCharacteristics);
export const getRatings = handlePlayerRequest(playersService.getRatings);
export const getAttributeOverviews = handlePlayerRequest(playersService.getAttributeOverviews);
export const getNationalTeamStatistics = handlePlayerRequest(playersService.getNationalTeamStatistics);
export const getTransferHistory = handlePlayerRequest(playersService.getTransferHistory);
export const getLastYearSummary = handlePlayerRequest(playersService.getLastYearSummary);
export const getStatisticsSeasons = handlePlayerRequest(playersService.getStatisticsSeasons);
export const getAllStatistics = handlePlayerRequest(playersService.getAllStatistics);
export const getStatistics = handlePlayerRequest(playersService.getStatistics);
export const getLastMatches = handlePlayerRequest(playersService.getLastMatches);
export const getNextMatches = handlePlayerRequest(playersService.getNextMatches);
export const getLastRatings = handlePlayerRequest(playersService.getLastRatings);
export const getMatches = handlePlayerRequest(playersService.getMatches);
export const searchPlayers = handlePlayerRequest(playersService.searchPlayers, false);