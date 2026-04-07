import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import tickerRoutes from './routes/ticker.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tickers', tickerRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// UPGRADE 1: Global Error Handler
// If any route throws an unexpected error, it gets caught here instead of crashing the Node process.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🚨 Unhandled Express Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;