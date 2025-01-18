import express from 'express';
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './files',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pythonProcess = spawn('python3', ['parser.py', req.file.path]);
    let result = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Failed to process file' });
      }
      try {
        const parsedResult = JSON.parse(result);
        res.json(parsedResult);
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse Python output' });
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;