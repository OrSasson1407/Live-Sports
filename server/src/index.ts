import http from 'http';
import app from './app';
import { config } from './config';
import { initSocketServer } from './socket/socketManager';
import { startExternalStream } from './services/realSportsStream';
import { startAlertEngine } from './services/alertEngine';

const server = http.createServer(app);

initSocketServer(server);
startAlertEngine();
startExternalStream();

server.listen(config.port, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 REST API active on http://localhost:${config.port}`);
  console.log(`📡 WebSockets active on ws://localhost:${config.port}`);
  console.log(`🛡️  Alert Engine running in the background`);
  console.log(`-----------------------------------------`);
});

const shutdown = () => {
  console.log('\n🛑 Initiating graceful shutdown...');
  server.close(() => {
    console.log('✅ HTTP and WebSocket servers closed safely.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
