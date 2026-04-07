import { Request, Response } from 'express';
import * as managersService from '../services/managers.service';

export const getCareerHistory = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.query;
    if (!managerId) return res.status(400).json({ error: 'managerId query parameter is required' });
    
    const data = await managersService.getCareerHistory(managerId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch career history', details: error.message });
  }
};

export const getDetail = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.query;
    if (!managerId) return res.status(400).json({ error: 'managerId query parameter is required' });
    
    const data = await managersService.getDetail(managerId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch manager details', details: error.message });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.query;
    if (!managerId) return res.status(400).json({ error: 'managerId query parameter is required' });
    
    // Note: If Sofascore returns raw image binary (like a PNG) instead of JSON, 
    // you may need to adjust this to pipe the image directly to the client.
    const data = await managersService.getImage(managerId as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch manager image', details: error.message });
  }
};

export const getLastMatches = async (req: Request, res: Response) => {
  try {
    const { managerId, pageIndex } = req.query;
    if (!managerId) return res.status(400).json({ error: 'managerId query parameter is required' });
    
    const page = pageIndex ? parseInt(pageIndex as string, 10) : 0;
    const data = await managersService.getLastMatches(managerId as string, page);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch last matches', details: error.message });
  }
};

export const getNextMatches = async (req: Request, res: Response) => {
  try {
    const { managerId, pageIndex } = req.query;
    if (!managerId) return res.status(400).json({ error: 'managerId query parameter is required' });
    
    const page = pageIndex ? parseInt(pageIndex as string, 10) : 0;
    const data = await managersService.getNextMatches(managerId as string, page);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch next matches', details: error.message });
  }
};

// Deprecated Controllers
export const getMatches = async (req: Request, res: Response) => {
  try {
    const { managerId, pageIndex } = req.query;
    if (!managerId) return res.status(400).json({ error: 'managerId query parameter is required' });
    
    const page = pageIndex ? parseInt(pageIndex as string, 10) : 0;
    const data = await managersService.getMatches(managerId as string, page);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch matches', details: error.message });
  }
};

export const searchManagers = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'name query parameter is required' });
    
    const data = await managersService.searchManagers(name as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to search managers', details: error.message });
  }
};