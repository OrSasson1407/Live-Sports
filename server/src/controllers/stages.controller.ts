import { Request, Response } from 'express';
import * as stagesService from '../services/stages.service';

const handleStageRequest = (serviceFn: Function) => async (req: Request, res: Response) => {
  try {
    const { stageId, ...rest } = req.query;
    if (!stageId) return res.status(400).json({ error: 'stageId is required' });
    
    const data = await serviceFn(stageId as string, rest);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Stages API Error', details: error.message });
  }
};

export const getScheduledEvents = handleStageRequest(stagesService.getScheduledEvents);
export const getDetail = handleStageRequest(stagesService.getDetail);
export const getSubstages = handleStageRequest(stagesService.getSubstages);
export const getDriverPerformance = handleStageRequest(stagesService.getDriverPerformance);
export const getStandings = handleStageRequest(stagesService.getStandings);
export const getHighlights = handleStageRequest(stagesService.getHighlights);
export const getRaces = handleStageRequest(stagesService.getRaces);
export const getOdds = handleStageRequest(stagesService.getOdds);