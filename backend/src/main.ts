import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { initStellarConfig } from './config/stellar.js';
import { initDB } from './db/db.js';
import healthRoutes from './routes/health.js';
import propertiesRoutes from './routes/properties.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize
let initialized = false;

const initializeApp = async () => {
  if (initialized) return;
  try {
    logger.info('Initializing Stellar configuration...');
    await initStellarConfig();
    
    logger.info('Initializing database...');
    await initDB();
    
    logger.info('✅ Proptify backend initialized');
    initialized = true;
  } catch (err) {
    logger.error('Initialization failed:', err);
    process.exit(1);
  }
};

// Routes
app.use('/health', healthRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
const server = app.listen(PORT, async () => {
  await initializeApp();
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
