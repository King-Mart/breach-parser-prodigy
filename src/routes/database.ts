import express from 'express';
import { pool } from '../database/init';

const router = express.Router();

router.get('/rows', async (req, res) => {
  try {
    const query = `
      SELECT * FROM accounts 
      ORDER BY id DESC 
      LIMIT 100
    `;

    const [results] = await pool.query(query);
    res.json(results || []);
  } catch (error: any) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Database query failed', 
      details: error.message,
      code: error.code 
    });
  }
});

export default router;