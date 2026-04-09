// client/src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { useSportsStore, GameTick } from '../store/useSportsStore';

const WS_URL = 'ws://localhost:3001';

export function useWebSocket(gameIdsToSubscribe: string[]) {
  const setConnected = useSportsStore((state) => state.setConnected);
  const updateGame = useSportsStore((state) => state.updateGame);
  const setGames = useSportsStore((state) => state.setGames);

  // Safely track the subscription list without causing re-renders
  const subsRef = useRef(gameIdsToSubscribe);
  useEffect(() => {
    subsRef.current = gameIdsToSubscribe;
  }, [gameIdsToSubscribe]);

  useEffect(() => {
    // 🔥 THE FIX: These local variables are tightly bound to THIS specific mount.
    // They cannot be overwritten or confused by React Strict Mode remounts.
    let isIntentionalClose = false;
    let isMounted = true;
    let ws: WebSocket | null = null;
    let reconnectTimeout: number | null = null;

    function connect() {
      if (!isMounted) return;

      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        // If React unmounted while we were waiting to connect, abort safely.
        if (!isMounted) {
          ws?.close();
          return;
        }

        console.log('🟢 Connected to Sports Server');
        setConnected(true);

        // Send our subscriptions
        subsRef.current.forEach((gameId) => {
          ws?.send(JSON.stringify({ action: 'subscribe', gameId }));
        });
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const parsed = JSON.parse(event.data);
          
          // Handle the SYNC and TICK payloads with proper TypeScript casting
          if (parsed.type === 'SYNC') {
            setGames(parsed.data as GameTick[]);
          } 
          else if (parsed.type === 'TICK') {
            updateGame(parsed.data as GameTick);
          } 
          else if (parsed.type === 'ALERT') {
            console.log('🚨 ALERT:', parsed.data.message);
          }
        } catch (err) {
          console.error("Failed to parse websocket message", err);
        }
      };

      ws.onclose = () => {
        // If this specific effect unmounted, stop the loop completely!
        if (isIntentionalClose) return;

        console.log('🔴 Disconnected from Server. Attempting reconnect...');
        setConnected(false);
        reconnectTimeout = window.setTimeout(connect, 3000);
      };
    }

    connect();

    // Cleanup when React unmounts this component
    return () => {
      isMounted = false;
      isIntentionalClose = true; // Flips the kill switch for THIS specific socket
      
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, []); // Empty array ensures this only runs ONCE on mount
}