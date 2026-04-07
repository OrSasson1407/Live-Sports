import { Request, Response } from 'express';
// 1. We must import the service to use it below
// Ensure the file actually exists at: src/services/general.service.ts
import * as generalService from '../services/general.service'; 

export const search = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query "q" is required' });
    
    const data = await generalService.search(q as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

export const getCategoriesList = async (req: Request, res: Response) => {
  try {
    const data = await generalService.getCategoriesList();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
};

export const getCategoriesListLive = async (req: Request, res: Response) => {
  try {
    const data = await generalService.getCategoriesListLive();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch live categories', details: error.message });
  }
};

export const getSportsList = async (req: Request, res: Response) => {
  try {
    const data = await generalService.getSportsList();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sports list', details: error.message });
  }
};

export const getAutoComplete = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const data = await generalService.getAutoComplete(q as string || '');
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Auto-complete failed', details: error.message });
  }
};