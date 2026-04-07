import fetch from 'node-fetch';

export const fetchFromSofascore = async (endpoint: string, queryParams: Record<string, any> = {}) => {
  // Convert { managerId: '123' } to "?managerId=123"
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://${process.env.RAPIDAPI_HOST}${endpoint}${queryString ? `?${queryString}` : ''}`;

  console.log(`[Sofascore API] Fetching: ${url}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': process.env.RAPIDAPI_HOST as string,
      'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Sofascore API error: ${response.statusText} (${response.status})`);
  }

  return await response.json();
};