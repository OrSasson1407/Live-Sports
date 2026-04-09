// server/src/socket/WebSocketService.ts
import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { config } from '../config/index';

// Attach an isAlive property to track dead connections and rooms for Pub/Sub
interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
  rooms: Set<string>;
}

export class WebSocketService {
  private static wss: WebSocketServer;

  public static init(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: ExtWebSocket) => {
      // Initialize connection state
      ws.isAlive = true;
      ws.rooms = new Set(['ALL']); // Subscribe to ALL room by default

      console.log('🟢 Client connected. Total active:', this.wss.clients.size);

      // Heartbeat response
      ws.on('pong', () => { 
        ws.isAlive = true; 
      });

      // Handle incoming messages from the client
      ws.on('message', (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          this.handleClientMessage(ws, parsed);
        } catch (e) {
          console.error('Invalid WebSocket message received:', message.toString());
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log('🔴 Client disconnected. Total active:', this.wss.clients.size);
      });
    });

    // Start Heartbeat check to prevent ghost connections (memory leaks)
    setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        const extWs = ws as ExtWebSocket;
        // If client hasn't responded to the last ping, terminate them
        if (!extWs.isAlive) {
          console.log('👻 Terminating unresponsive ghost client');
          return extWs.terminate();
        }
        
        // Mark as dead until they respond with a pong
        extWs.isAlive = false;
        extWs.ping();
      });
    }, config.wsHeartbeatInterval);
  }

  /**
   * Processes commands sent by the React client (e.g., subscribing to a specific game)
   */
  private static handleClientMessage(ws: ExtWebSocket, payload: any) {
    if (payload.action === 'subscribe' && payload.gameId) {
      ws.rooms.add(payload.gameId);
      console.log(`➕ Client subscribed to room: ${payload.gameId}`);
    }
    
    if (payload.action === 'unsubscribe' && payload.gameId) {
      ws.rooms.delete(payload.gameId);
      console.log(`➖ Client unsubscribed from room: ${payload.gameId}`);
    }
  }

  /**
   * Broadcasts data ONLY to clients subscribed to 'ALL' or the specific game room.
   */
  public static broadcast(gameId: string, type: 'TICK' | 'ALERT', data: any) {
    if (!this.wss) return;

    const message = JSON.stringify({ type, data });

    this.wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtWebSocket;
      
      // Check if connection is fully open
      if (extWs.readyState === WebSocket.OPEN) {
        // Only send if they are subscribed to ALL or this specific game's room
        if (extWs.rooms.has('ALL') || extWs.rooms.has(gameId)) {
          extWs.send(message);
        }
      }
    });
  }
}