import { Request, Response } from 'express';
import * as matchService from '../services/match.service';

export const fetchLiveMatches = async (req: Request, res: Response) => {
  try {
    const liveMatches = await matchService.getLiveMatches();
    res.json(liveMatches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
};