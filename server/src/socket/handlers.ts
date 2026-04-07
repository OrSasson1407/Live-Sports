import { WebSocket } from 'ws';
import { ClientMessage } from '../types/ticker';

// UPGRADE 1: Extend the standard WebSocket to include an "isAlive" flag.
// This is critical for the server to know if a user closed their laptop without officially disconnecting.
export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

// Tracks which client is subscribed to which games
export const clientSubscriptions = new Map<ExtWebSocket | WebSocket, Set<string>>();

export function handleClientMessage(ws: ExtWebSocket | WebSocket, message: string) {
  try {
    // SPORTS UPGRADE: Cast parsed message to ClientMessage to enforce type safety
    const parsed: ClientMessage = JSON.parse(message);
    const { action, gameId } = parsed;

    // Ensure the client has a Set in our map
    if (!clientSubscriptions.has(ws)) {
      clientSubscriptions.set(ws, new Set());
    }

    const subs = clientSubscriptions.get(ws)!;

    switch (action) {
      case 'subscribe':
        // SPORTS UPGRADE: Check for gameId instead of symbol
        if (gameId) {
          subs.add(gameId.toUpperCase());
          console.log(`Client subscribed to ${gameId}`);
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

// Cleanup function to prevent memory leaks when a user closes their browser tab
export function removeClient(ws: ExtWebSocket | WebSocket) {
  clientSubscriptions.delete(ws);
}