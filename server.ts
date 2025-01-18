import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2';

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({ 
  dest: uploadsDir,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

app.use(cors());
app.use(express.json());

// Handle file upload and parsing
app.post('/api/parse', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const pythonScript = path.join(__dirname, 'parser.py');
  
  // Verify python script exists
  if (!fs.existsSync(pythonScript)) {
    return res.status(500).json({ error: 'Parser script not found' });
  }

  const command = `python ${pythonScript} ${req.file.path}`;

  exec(command, (error, stdout, stderr) => {
    // Clean up uploaded file
    fs.unlink(req.file!.path, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res.status(500).json({ error: 'Failed to process file' });
    }

    if (stderr) {
      console.error(`Python script stderr: ${stderr}`);
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
      console.error('Error parsing Python script output:', e);
      res.status(500).json({ error: 'Failed to parse Python script output' });
    }
  });
});

// Create database if it doesn't exist and then create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'deepcode',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // Allow multiple statements for initialization
});

// Initialize database schema
const initializeDatabase = async () => {
  const schemaPath = path.join(__dirname, 'initialize_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  return new Promise((resolve, reject) => {
    pool.query(schema, (error) => {
      if (error) {
        console.error('Failed to initialize database schema:', error);
        reject(error);
      } else {
        console.log('Database schema initialized successfully');
        resolve(true);
      }
    });
  });
};

// Handle database rows fetch
app.get('/api/database/rows', (req, res) => {
  const query = `
    SELECT * FROM accounts 
    ORDER BY id DESC 
    LIMIT 100
  `;

  pool.query(query, (error: any, results: any) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database query failed', details: error.message });
    }
    
    res.json(results);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    // Initialize database schema
    await initializeDatabase();
    
    // Test database connection
    await new Promise((resolve, reject) => {
      pool.query('SELECT 1', (err) => {
        if (err) {
          console.error('Database connection failed:', err);
          reject(err);
        } else {
          console.log('Database connection successful');
          resolve(true);
        }
      });
    });
    
    console.log(`Server running on port ${PORT}`);
    console.log(`Upload directory: ${uploadsDir}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});