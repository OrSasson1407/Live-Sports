import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  rapidApiKey: process.env.RAPIDAPI_KEY || '',
  rapidApiHost: process.env.RAPIDAPI_HOST || 'sofascore.p.rapidapi.com',
  sportsToPoll: process.env.SPORTS_TO_POLL?.split(',') || ['football', 'basketball'],
  pollInterval: parseInt(process.env.POLL_INTERVAL || '60000'),
  wsHeartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL || '30000'),
};