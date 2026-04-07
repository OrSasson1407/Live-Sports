import { Request, Response } from 'express';
import * as matchService from '../services/match.service';

// Helper to wrap async controller logic with caching
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 60 seconds

const handleRequest = (serviceMethod: Function) => async (req: Request, res: Response) => {
  try {
    const { id, playerId } = req.params;
    const cacheKey = `${id}-${playerId || 'none'}-${serviceMethod.name}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }
    
    // Fetch fresh data
    const data = playerId ? await serviceMethod(id, playerId) : await serviceMethod(id);
    
    // Store in cache
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    res.json(data);
  } catch (error: any) {
    console.error(`[Match Controller] Error in ${serviceMethod.name}:`, error.message);
    res.status(500).json({ 
      error: 'Request failed', 
      details: error.message,
      endpoint: req.path
    });
  }
};

// Basic Detail
export const getDetail = handleRequest(matchService.getMatchDetail);
export const getAiInsights = handleRequest(matchService.getAiInsights);

// Insights & Social
export const getComments = handleRequest(matchService.getComments);  // ✅ FIXED
export const getTweets = handleRequest(matchService.getTweets);
export const getMedia = handleRequest(matchService.getMedia);

// Match Data
export const getLineups = handleRequest(matchService.getLineups);
export const getIncidents = handleRequest(matchService.getIncidents);
export const getStatistics = handleRequest(matchService.getStatistics);
export const getGraph = handleRequest(matchService.getGraph);
export const getVotes = handleRequest(matchService.getVotes);
export const getManagers = handleRequest(matchService.getManagers);
export const getTeamStreaks = handleRequest(matchService.getTeamStreaks);
export const getBestPlayers = handleRequest(matchService.getBestPlayers);

// Player Specific
export const getPlayerStatistics = handleRequest(matchService.getPlayerStatistics);
export const getPlayerHeatmap = handleRequest(matchService.getPlayerHeatmap);

// Odds
export const getAllOdds = handleRequest(matchService.getAllOdds);
export const getFeaturedOdds = handleRequest(matchService.getFeaturedOdds);

// H2H
export const getH2HEvents = handleRequest(matchService.getH2HEvents);
export const getH2H = handleRequest(matchService.getH2H);

// Esport
export const getEsportGames = handleRequest(matchService.getEsportGames);