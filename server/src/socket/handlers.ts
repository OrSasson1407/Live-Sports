import { WebSocket } from 'ws';
import { ClientMessage } from '../types/ticker';
import { currentGames } from '../services/realSportsStream'; 

export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

export const clientSubscriptions = new Map<ExtWebSocket | WebSocket, Set<string>>();

export function handleClientMessage(ws: ExtWebSocket | WebSocket, message: string) {
  try {
    const parsed: ClientMessage = JSON.parse(message);
    const { action, gameId } = parsed;

    if (!clientSubscriptions.has(ws)) {
      clientSubscriptions.set(ws, new Set());
    }
    const subs = clientSubscriptions.get(ws)!;

    switch (action) {
      case 'subscribe':
        const idToSub = gameId ? gameId.toUpperCase() : 'ALL';
        subs.add(idToSub);
        console.log(`Client subscribed to: ${idToSub}`);

        // Blast the current live games immediately so the UI doesn't have a blank screen
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

      default:
        console.warn('Unknown action received from client:', action);
    }
  } catch (error) {
    console.error('Failed to parse client message:', message);
  }
}

export function removeClient(ws: ExtWebSocket | WebSocket) {
  clientSubscriptions.delete(ws);
}