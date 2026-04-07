import { useEffect, useRef } from 'react';
import { useSportsStore } from '../store/useSportsStore';

const WS_URL = 'ws://localhost:3001';

export function useWebSocket(gameIdsToSubscribe: string[]) {
  const ws = useRef<WebSocket | null>(null);
  
  // UPGRADE: Changed from NodeJS.Timeout to a standard browser 'number' and initialized with null
  const reconnectTimeout = useRef<number | null>(null);
  
  const setConnected = useSportsStore((state) => state.setConnected);
  const updateGame = useSportsStore((state) => state.updateGame);

  useEffect(() => {
    function connect() {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('🟢 Connected to Sports Server');
        setConnected(true);

        gameIdsToSubscribe.forEach((gameId) => {
          ws.current?.send(JSON.stringify({ action: 'subscribe', gameId }));
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          
          if (parsed.type === 'TICK') {
            updateGame(parsed.data);
          } else if (parsed.type === 'ALERT') {
            console.log('🚨 ALERT:', parsed.data.message);
            // Optional: Trigger a browser notification here later!
          }
        } catch (err) {
          console.error("Failed to parse websocket message");
        }
      };

      ws.current.onclose = () => {
        console.log('🔴 Disconnected from Server. Attempting reconnect...');
        setConnected(false);
        // Auto-reconnect backoff 
        reconnectTimeout.current = window.setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      // Clear the timeout safely
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [gameIdsToSubscribe]); 
}