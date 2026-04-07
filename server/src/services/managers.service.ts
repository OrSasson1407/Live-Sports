import { fetchFromSofascore } from './sofascore.service';

export const getCareerHistory = async (managerId: string) => {
  return await fetchFromSofascore('/managers/get-career-history', { managerId });
};

export const getDetail = async (managerId: string) => {
  return await fetchFromSofascore('/managers/detail', { managerId });
};

export const getImage = async (managerId: string) => {
  return await fetchFromSofascore('/managers/get-image', { managerId });
};

export const getLastMatches = async (managerId: string, pageIndex: number) => {
  return await fetchFromSofascore('/managers/get-last-matches', { managerId, pageIndex });
};

export const getNextMatches = async (managerId: string, pageIndex: number) => {
  return await fetchFromSofascore('/managers/get-next-matches', { managerId, pageIndex });
};

// Deprecated Endpoints
export const getMatches = async (managerId: string, pageIndex: number) => {
  return await fetchFromSofascore('/managers/get-matches', { managerId, pageIndex });
};

export const searchManagers = async (name: string) => {
  return await fetchFromSofascore('/managers/search', { name });
};