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
    
    await pool.query(schema);
    console.log('Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export { pool };