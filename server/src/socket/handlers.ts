import { WebSocket } from 'ws';
import { ClientMessage } from '../types/ticker';
import { currentGames } from '../services/realSportsStream'; 
import { addAlert } from '../services/alertEngine';

export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

export const clientSubscriptions = new Map<ExtWebSocket | WebSocket, Set<string>>();

export function handleClientMessage(ws: ExtWebSocket | WebSocket, message: string) {
  try {
    const parsed: ClientMessage = JSON.parse(message);
    const { action, gameId, payload } = parsed;

    if (!clientSubscriptions.has(ws)) {
      clientSubscriptions.set(ws, new Set());
    }
    const subs = clientSubscriptions.get(ws)!;

    switch (action) {
      case 'subscribe':
        const idToSub = gameId ? gameId.toUpperCase() : 'ALL';
        subs.add(idToSub);
        console.log(`Client subscribed to: ${idToSub}`);

        // Blast the current live games immediately
        if (idToSub === 'ALL') {
          currentGames.forEach((game) => {
            ws.send(JSON.stringify({ type: 'TICK', data: game }));
          });
        } else {
          const specificGame = currentGames.get(idToSub);
          if (specificGame) {
            ws.send(JSON.stringify({ type: 'TICK', data: specificGame }));
          }
        }
        break;

      case 'unsubscribe':
        if (gameId) {
          subs.delete(gameId.toUpperCase());
          console.log(`Client unsubscribed from ${gameId}`);
        }
        break;

      // ✅ NEW: Alert creation
      case 'add_alert':
        if (!payload || !payload.gameId || !payload.condition) {
          ws.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'Missing alert params. Required: gameId, condition' 
          }));
          return;
        }
        
        const newAlert = addAlert({
          gameId: payload.gameId,
          condition: payload.condition,
          threshold: payload.threshold
        });
        
        ws.send(JSON.stringify({ 
          type: 'ALERT_CREATED', 
          data: newAlert 
        }));
        console.log(`Alert created: ${newAlert.id} for ${newAlert.gameId}`);
        break;

      default:
        console.warn('Unknown action received from client:', action);
        ws.send(JSON.stringify({ 
          type: 'ERROR', 
          message: `Unknown action: ${action}` 
        }));
    }
  } catch (error) {
    console.error('Failed to parse client message:', message);
    ws.send(JSON.stringify({ 
      type: 'ERROR', 
      message: 'Invalid message format' 
    }));
  }
}

export function removeClient(ws: ExtWebSocket | WebSocket) {
  clientSubscriptions.delete(ws);
}