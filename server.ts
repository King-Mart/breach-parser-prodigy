import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Handle file upload and parsing
app.post('/api/parse', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const pythonScript = path.join(__dirname, 'parser.py');
  const command = `python ${pythonScript} ${req.file.path}`;

  exec(command, (error, stdout, stderr) => {
    // Clean up uploaded file
    fs.unlinkSync(req.file!.path);

    if (error) {
      console.error(`Error: ${error}`);
      return res.status(500).json({ error: 'Failed to process file' });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
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

  // Execute query using mysql2
  const mysql = require('mysql2');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});