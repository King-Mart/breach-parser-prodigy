import express from 'express';
import { pool } from '../database/init';

const router = express.Router();

router.get('/rows', (req, res) => {
  const query = `
    SELECT * FROM accounts 
    ORDER BY id DESC 
    LIMIT 100
  `;

  pool.query(query, (error: any, results: any) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ 
        error: 'Database query failed', 
        details: error.message,
        code: error.code 
      });
    }
    
    res.json(results || []);
  });
});

export default router;