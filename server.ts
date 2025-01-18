import express from 'express';
import cors from 'cors';
import { initializeDatabase, testConnection } from './src/database/init';
import databaseRoutes from './src/routes/database';
import uploadRoutes from './src/routes/upload';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/database', databaseRoutes);
app.use('/api', uploadRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    code: err.code
  });
});

const PORT = process.env.PORT || 3000;

// Start server with enhanced error handling
const startServer = async () => {
  try {
    // Initialize database schema
    await initializeDatabase();
    
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();