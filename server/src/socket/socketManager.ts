import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
// SPORTS UPGRADE: Point this to our new Mock Sports Engine
import { streamEvents } from '../services/mockSportsStream'; 
import { alertEvents } from '../services/alertEngine';
// SPORTS UPGRADE: Import GameTick instead of Tick
import { GameTick } from '../types/ticker'; 
import { handleClientMessage, removeClient, clientSubscriptions, ExtWebSocket } from './handlers';

export function initSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: ExtWebSocket) => {
    console.log('🟢 React Client Connected to Local WebSocket');

    // UPGRADE 1: Initialize the heartbeat status for this new client
    ws.isAlive = true;
    
    // When the client responds to our ping, mark them as still alive
    ws.on('pong', () => { 
      ws.isAlive = true; 
    });

    // --- 1. Filtered Tick Broadcast ---
    // SPORTS UPGRADE: Accept GameTick instead of Tick
    const tickListener = (tick: GameTick) => {
      if (ws.readyState === WebSocket.OPEN) {
        // ONLY send the tick if the client is actively subscribed to this game!
        const subs = clientSubscriptions.get(ws);
        // SPORTS UPGRADE: Check against tick.gameId instead of tick.symbol
        if (subs && subs.has(tick.gameId)) {
          ws.send(JSON.stringify({ type: 'TICK', data: tick }));
        }
      }
    };
    streamEvents.on('tick', tickListener);

    // --- 2. Listen for Triggered Alerts ---
    const alertListener = (alertData: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ALERT', data: alertData }));
      }
    };
    alertEvents.on('triggered', alertListener);

    // --- 3. Handle Client Messages ---
    ws.on('message', (message: Buffer) => {
      handleClientMessage(ws, message.toString());
    });

    // --- 4. Cleanup on Disconnect ---
    ws.on('close', () => {
      console.log('🔴 React Client Disconnected');
      
      // CRITICAL: Remove internal event listeners to prevent memory leaks
      streamEvents.off('tick', tickListener);
      alertEvents.off('triggered', alertListener);
      
      // Remove client's subscription list from memory
      removeClient(ws); 
    });
  });

  // UPGRADE 2: Memory Leak Prevention Interval (The "Ping/Pong" loop)
  // Every 30 seconds, check every connected client.
  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const extWs = client as ExtWebSocket;
      
      // If they didn't respond to the last ping, terminate their connection
      if (!extWs.isAlive) {
        console.log('💀 Terminating dead or inactive connection...');
        return extWs.terminate();
      }
      
      // Assume dead until they respond to the ping we are about to send
      extWs.isAlive = false;
      extWs.ping();
    });
  }, 30000);

  // Stop the interval if the server fully closes
  wss.on('close', () => {
    clearInterval(interval);
  });

  console.log('🔌 Local WebSocket Server Initialized (with Heartbeat)');
}