import { fetchFromSofascore } from './sofascore.service';

const get = async (path: string, stageId: string, extraParams: any = {}) => 
  fetchFromSofascore(`/stages/${path}`, { stageId, ...extraParams });

export const getScheduledEvents = (id: string, q: any) => get('get-scheduled-events', id, q);
export const getDetail = (id: string, q: any) => get('detail', id, q);
export const getSubstages = (id: string, q: any) => get('get-substages', id, q);
export const getDriverPerformance = (id: string, q: any) => get('get-driver-performance', id, q);
export const getStandings = (id: string, q: any) => get('get-standings', id, q);
export const getHighlights = (id: string, q: any) => get('get-highlights', id, q);
export const getRaces = (id: string, q: any) => get('get-races', id, q);
export const getOdds = (id: string, q: any) => get('get-odds', id, q);