// server/src/index.ts
import http from 'http';
import app from './app';
import { PrismaClient } from '@prisma/client';
import { config } from './config/index';
import { WebSocketService } from './socket/WebSocketService';
import { LiveFeedEngine } from './services/LiveFeedEngine';

const server = http.createServer(app);
const prisma = new PrismaClient();

// Initialize the new Advanced WebSocket Pub/Sub System
WebSocketService.init(server);

// Start the Smart Polling Engine
LiveFeedEngine.start();

server.listen(config.port, () => {
  console.log(`\n=============================================`);
  console.log(`🚀 REST API active on http://localhost:${config.port}`);
  console.log(`📡 Advanced WebSockets active on ws://localhost:${config.port}`);
  console.log(`🧠 Cache & Diff Engine Running`);
  console.log(`🔄 Polling ${config.sportsToPoll.join(', ')} every ${config.pollInterval / 1000}s`);
  console.log(`=============================================\n`);
});

const shutdown = async () => {
  console.log('\n🛑 Initiating graceful shutdown...');
  
  // 1. Stop polling
  LiveFeedEngine.stop();
  
  // 2. Disconnect database connections safely
  await prisma.$disconnect();
  console.log('📦 Database disconnected.');

  // 3. Close server and websockets
  server.close(() => {
    WebSocketService.closeAll();
    console.log('✅ HTTP and WebSocket servers closed safely.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);