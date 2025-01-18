import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
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

router.post('/parse', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const pythonScript = path.join(__dirname, '../../parser.py');
  
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

export default router;