import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { config } from '../config';
import { Tick } from '../types/ticker';

// This is the internal bridge. 
export const streamEvents = new EventEmitter();

// UPGRADE 1: Keep track of the active connection in memory. 
// This prevents multiple WebSockets from opening at the same time if a reconnect happens.
let ws: WebSocket | null = null;

export function startExternalStream() {
  // UPGRADE 2: Ensure any "zombie" connection is killed before starting a new one.
  if (ws) ws.close();

  // Subscribing to BTC, ETH, and SOL trade streams
  const streams = ['btcusdt@trade', 'ethusdt@trade', 'solusdt@trade'].join('/');
  const wsUrl = `${config.binanceWsUrl}/${streams}`;

  ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    console.log(`🌍 Connected to External Data Source (Binance)`);
  });

  ws.on('message', (data: WebSocket.RawData) => {
    try {
      const parsed = JSON.parse(data.toString());
      
      if (parsed.e === 'trade') {
        const tick: Tick = {
          symbol: parsed.s, 
          price: parseFloat(parsed.p), 
          timestamp: parsed.T, 
        };
        
        streamEvents.emit('tick', tick);
      }
    } catch (error) {
      // UPGRADE 3: Silently catch parse errors. 
      // If Binance sends one weird string, we don't want it spamming our terminal or crashing the app.
    }
  });

  ws.on('close', () => {
    console.log('⚠️ External stream closed. Reconnecting in 5s...');
    setTimeout(startExternalStream, 5000);
  });

  ws.on('error', (err) => {
    console.error('External stream error:', err.message);
    // UPGRADE 4: Force close on error. This guarantees the 'close' event above will fire
    // and successfully trigger our reconnect timer.
    ws?.close(); 
  });
}