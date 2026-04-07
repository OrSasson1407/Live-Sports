import { Request, Response } from 'express';
import * as tvChannelsService from '../services/tvchannels.service';

export const getAvailableCountries = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.query;
    if (!matchId) return res.status(400).json({ error: 'matchId query parameter is required' });
    
    const data = await tvChannelsService.getAvailableCountries(matchId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch available countries', details: error.message });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const { countryCode } = req.query;
    if (!countryCode) return res.status(400).json({ error: 'countryCode query parameter is required (e.g., GB)' });
    
    const data = await tvChannelsService.getList(countryCode as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch TV channels list', details: error.message });
  }
};

export const getVotes = async (req: Request, res: Response) => {
  try {
    const { matchId, channelId } = req.query;
    if (!matchId || !channelId) {
      return res.status(400).json({ error: 'Both matchId and channelId query parameters are required' });
    }
    
    const data = await tvChannelsService.getVotes(matchId as string, channelId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch TV channel votes', details: error.message });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.query;
    if (!channelId) return res.status(400).json({ error: 'channelId query parameter is required' });
    
    const data = await tvChannelsService.getSchedules(channelId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch TV channel schedules', details: error.message });
  }
};