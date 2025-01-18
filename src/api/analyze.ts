import { spawn } from 'child_process';

export async function analyzeUrl(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['parser.py', url]);
    let dataString = '';

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}`));
      } else {
        try {
          const parsedData = JSON.parse(dataString);
          resolve(parsedData);
        } catch (error) {
          reject(new Error('Failed to parse Python output'));
        }
      }
    });
  });
}