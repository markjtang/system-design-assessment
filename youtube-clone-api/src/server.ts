import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './scripts/initDatabase';
import videoRoutes from './routes/videos';
import favoriteRoutes from './routes/favorites';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'YouTube Clone API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/videos', videoRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database with tables and seed data
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 YouTube Clone API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📹 Videos API: http://localhost:${PORT}/api/videos`);
      console.log(`❤️ Favorites API: http://localhost:${PORT}/api/favorites`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

// Start the server
startServer(); 