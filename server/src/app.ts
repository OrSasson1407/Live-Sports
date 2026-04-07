import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
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

app.use(cors());
app.use(express.json());

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
  console.error('🚨 Unhandled Express Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

export default app;