import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  rapidApiKey: process.env.RAPIDAPI_KEY || '',
  rapidApiHost: process.env.RAPIDAPI_HOST || 'sofascore.p.rapidapi.com',
  sportsToPoll: process.env.SPORTS_TO_POLL?.split(',') || ['football'], // only one sport
  pollInterval: parseInt(process.env.POLL_INTERVAL || '300000', 10), // 5 minutes
  wsHeartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL || '30000', 10),
  requestDelayMs: parseInt(process.env.REQUEST_DELAY_MS || '0', 10), // no delay between sports (only one)
  // Enable mock data fallback when API fails. Defaults to true in development.
  enableMockFallback: process.env.ENABLE_MOCK_FALLBACK !== 'false',
};