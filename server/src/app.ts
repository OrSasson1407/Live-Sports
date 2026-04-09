// server/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/index';

// Import Routers
import tickerRoutes from './routes/ticker.routes';
import generalRoutes from './routes/general.routes';
import teamRoutes from './routes/teams.routes';
import matchRoutes from './routes/matches.routes';
import playerRoutes from './routes/players.routes';
import managerRoutes from './routes/managers.routes'; 
import tournamentRoutes from './routes/tournaments.routes'; 
import esportRoutes from './routes/esports.routes'; 
import tvChannelRoutes from './routes/tvchannels.routes'; 
import stageRoutes from './routes/stages.routes'; 

const app = express();

// Security and Performance Middleware
app.use(helmet()); 
app.use(compression()); 
app.use(cors()); // You can restrict this later: cors({ origin: config.clientUrl })
app.use(express.json({ limit: '10kb' })); 

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

// Main Domain Routes
app.use('/api', generalRoutes);
app.use('/api/tickers', tickerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/esport-games', esportRoutes);
app.use('/api/tvchannels', tvChannelRoutes);
app.use('/api/stages', stageRoutes);

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`🚨 [${req.method}] ${req.path} >> Error:`, {
    message: err.message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack })
  });
  
  const isProd = config.nodeEnv === 'production';

  res.status(err.status || 500).json({ 
    error: isProd ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
    timestamp: new Date().toISOString()
  });
});

export default app;