import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { streamEvents } from '../services/realSportsStream';
import { alertEvents } from '../services/alertEngine';
import { GameTick } from '../types/ticker';
import { handleClientMessage, removeClient, clientSubscriptions, ExtWebSocket } from './handlers';

export function initSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: ExtWebSocket) => {
    console.log('🟢 React Client Connected to Local WebSocket');

    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    const tickListener = (tick: GameTick) => {
      if (ws.readyState === WebSocket.OPEN) {
        const subs = clientSubscriptions.get(ws);
        if (subs && subs.has(tick.gameId)) {
          ws.send(JSON.stringify({ type: 'TICK', data: tick }));
        }
      }
    };
    streamEvents.on('tick', tickListener);

    const alertListener = (alertData: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ALERT', data: alertData }));
      }
    };
    alertEvents.on('triggered', alertListener);

    ws.on('message', (message: Buffer) => {
      handleClientMessage(ws, message.toString());
    });

    ws.on('close', () => {
      console.log('🔴 React Client Disconnected');
      streamEvents.off('tick', tickListener);
      alertEvents.off('triggered', alertListener);
      removeClient(ws);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const extWs = client as ExtWebSocket;
      if (!extWs.isAlive) {
        console.log('💀 Terminating dead connection...');
        return extWs.terminate();
      }
      extWs.isAlive = false;
      extWs.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));

  console.log('🔌 Local WebSocket Server Initialized (with Heartbeat)');
}
