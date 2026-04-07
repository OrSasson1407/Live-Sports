import { fetchFromSofascore } from './sofascore.service';

export const getAvailableCountries = async (matchId: string) => {
  return await fetchFromSofascore('/tvchannels/get-available-countries', { matchId });
};

export const getList = async (countryCode: string) => {
  return await fetchFromSofascore('/tvchannels/list', { countryCode });
};

export const getVotes = async (matchId: string, channelId: string) => {
  return await fetchFromSofascore('/tvchannels/get-votes', { matchId, channelId });
};

export const getSchedules = async (channelId: string) => {
  return await fetchFromSofascore('/tvchannels/get-schedules', { channelId });
};