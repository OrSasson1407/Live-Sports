import { fetchFromSofascore } from './sofascore.service';

/**
 * Global search for teams, players, and tournaments
 */
export const search = async (term: string) => {
  return await fetchFromSofascore('/search', { q: term });
};

/**
 * Get list of all sports categories
 */
export const getCategoriesList = async () => {
  return await fetchFromSofascore('/categories/list');
};

/**
 * Get list of categories that currently have live events
 */
export const getCategoriesListLive = async () => {
  return await fetchFromSofascore('/categories/list-live');
};

/**
 * Get all supported sports (Football, Basketball, Tennis, etc.)
 */
export const getSportsList = async () => {
  return await fetchFromSofascore('/sports/list');
};

/**
 * Deprecated: Auto-complete for search
 */
export const getAutoComplete = async (term: string) => {
  return await fetchFromSofascore('/auto-complete', { q: term });
};