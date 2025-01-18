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

// Handle database rows fetch
app.get('/api/database/rows', (req, res) => {
  const query = `
    SELECT * FROM accounts 
    ORDER BY id DESC 
    LIMIT 100
  `;

  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'deepcode'
  };

  const connection = mysql.createConnection(dbConfig);

  connection.query(query, (error: any, results: any) => {
    connection.end();
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database query failed' });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadsDir}`);
});