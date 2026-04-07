import fetch from 'node-fetch';
import { config } from '../config/index';

export const fetchFromSofascore = async (
  endpoint: string, 
  queryParams: Record<string, any> = {}, 
  retries: number = 3
) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://${config.rapidApiHost}${endpoint}${queryString ? `?${queryString}` : ''}`;

  if (config.nodeEnv === 'development') {
    console.log(`[Sofascore API] Fetching: ${url}`);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': config.rapidApiHost,
          'x-rapidapi-key': config.rapidApiKey,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Sofascore API error: ${response.statusText} (${response.status})`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`[Sofascore API] Attempt ${attempt}/${retries} failed:`, error.message);
      
      if (attempt === retries) {
        throw new Error(`Failed to fetch from Sofascore after ${retries} attempts: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }
};