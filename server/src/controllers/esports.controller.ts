import { Request, Response } from 'express';
import * as esportsService from '../services/esports.service';

export const getLineups = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.query;
    if (!matchId) return res.status(400).json({ error: 'matchId query parameter is required' });
    
    const data = await esportsService.getLineups(matchId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch esports lineups', details: error.message });
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.query;
    if (!matchId) return res.status(400).json({ error: 'matchId query parameter is required' });
    
    const data = await esportsService.getStatistics(matchId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch esports statistics', details: error.message });
  }
};

export const getRounds = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.query;
    if (!matchId) return res.status(400).json({ error: 'matchId query parameter is required' });
    
    const data = await esportsService.getRounds(matchId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch esports rounds', details: error.message });
  }
};

export const getBans = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.query;
    if (!matchId) return res.status(400).json({ error: 'matchId query parameter is required' });
    
    const data = await esportsService.getBans(matchId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch esports bans', details: error.message });
  }
};