import express, { Request, Response, NextFunction } from 'express';
import { config as loadEnv } from 'dotenv';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

import { authRouter } from './server/routes/authRoutes.js';
import { predictionRouter } from './server/routes/predictionRoutes.js';
import { crimeRouter } from './server/routes/crimeRoutes.js';
import { emergencyRouter } from './server/routes/emergencyRoutes.js';
import { routeRouter } from './server/routes/routeRoutes.js';
import { adminRouter } from './server/routes/adminRoutes.js';
import { reviewRouter } from './server/routes/reviewRoutes.js';
import { feedbackRouter } from './server/routes/feedbackRoutes.js';
import { placeImageRouter } from './server/routes/placeImageRoutes.js';
import { connectDB, closeDB } from './server/db.js';
import { assertAuthConfig } from './server/auth.js';

loadEnv({ path: ['.env.local', '.env'] });

async function startServer() {
  assertAuthConfig();
  await connectDB(); // fail fast if MongoDB is unreachable

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      system: 'AI-Powered Tourist Safety Risk Prediction System',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/prediction', predictionRouter);
  app.use('/api/crime', crimeRouter);
  app.use('/api/emergency', emergencyRouter);
  app.use('/api/routes', routeRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/reviews', reviewRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/place-image', placeImageRouter);

  // Unknown API routes -> JSON 404 (instead of the SPA's index.html)
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));

  // Vite middleware for development vs Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Central error handler: catches errors forwarded by async routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return;
    res.status(500).json({ error: 'Internal server error' });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tourist Safety System running on http://localhost:${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      closeDB().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err instanceof Error ? err.message : err);
  process.exit(1);
});
