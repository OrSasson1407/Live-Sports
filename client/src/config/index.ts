export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
    timeout: 10000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'LiveScore Pro',
    pollInterval: parseInt(import.meta.env.VITE_POLL_INTERVAL || '30000'),
    reconnectDelay: parseInt(import.meta.env.VITE_RECONNECT_DELAY || '3000'),
    maxReconnectAttempts: parseInt(import.meta.env.VITE_MAX_RECONNECT_ATTEMPTS || '10'),
  },
  features: {
    enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true',
    enableSoundAlerts: import.meta.env.VITE_ENABLE_SOUND_ALERTS === 'true',
    cacheTTL: parseInt(import.meta.env.VITE_CACHE_TTL || '60000'),
  },
} as const;