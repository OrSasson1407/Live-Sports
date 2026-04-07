import http from 'http';
import app from './app';
import { config } from './config';
import { initSocketServer } from './socket/socketManager';
import { startExternalStream } from './services/mockSportsStream';
import { startAlertEngine } from './services/alertEngine';

const server = http.createServer(app);

// 1. Init Local WebSocket Server (For the React frontend)
initSocketServer(server);

// 2. Start the Alert Engine (Listens for crossed thresholds)
startAlertEngine();

// 3. Start fetching live data from External Source (Binance)
startExternalStream();

// Start the actual server
server.listen(config.port, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 REST API active on http://localhost:${config.port}`);
  console.log(`📡 WebSockets active on ws://localhost:${config.port}`);
  console.log(`🛡️  Alert Engine running in the background`);
  console.log(`-----------------------------------------`);
});

// UPGRADE 1: Graceful Shutdown
// When you press Ctrl+C or if Vercel/Render restarts your app, this ensures
// the HTTP server and WebSockets stop accepting new connections before dying.
const shutdown = () => {
  console.log('\n🛑 Initiating graceful shutdown...');
  server.close(() => {
    console.log('✅ HTTP and WebSocket servers closed safely.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);