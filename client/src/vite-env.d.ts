/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_POLL_INTERVAL: string
  readonly VITE_RECONNECT_DELAY: string
  readonly VITE_MAX_RECONNECT_ATTEMPTS: string
  readonly VITE_ENABLE_ANIMATIONS: string
  readonly VITE_ENABLE_SOUND_ALERTS: string
  readonly VITE_CACHE_TTL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}