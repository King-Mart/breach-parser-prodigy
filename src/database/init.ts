import fs from 'fs';
import path from 'path';
import { createPool } from '../config/database';

const pool = createPool();

export const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, '../../initialize_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Schema file not found');
    }
    
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
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const testConnection = async () => {
  return new Promise((resolve, reject) => {
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
};

export { pool };