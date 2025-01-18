import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const python = spawn('python', ['parser.py', url]);
    let dataString = '';

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    await new Promise((resolve, reject) => {
      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}`));
        } else {
          try {
            const parsedData = JSON.parse(dataString);
            res.status(200).json(parsedData);
          } catch (error) {
            reject(new Error('Failed to parse Python output'));
          }
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error analyzing URL:', error);
    res.status(500).json({ message: 'Failed to analyze URL' });
  }
}