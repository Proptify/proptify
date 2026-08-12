import { Router, Request, Response } from 'express';
import { query } from '../db/db.js';
import { logger } from '../utils/logger.js';

const router = Router();

// GET /api/properties - List all properties
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM properties WHERE status = $1 ORDER BY created_at DESC', ['active']);
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    logger.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id - Get property details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM properties WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    logger.error('Error fetching property:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST /api/properties - Create property (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, location, description, property_type, total_tokens, price_per_token, apy, contract_id } = req.body;

    const result = await query(
      `INSERT INTO properties (name, location, description, property_type, total_tokens, price_per_token, apy, contract_id, admin_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, location, description, property_type, total_tokens, price_per_token, apy, contract_id, process.env.ADMIN_PUBLIC_KEY]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    logger.error('Error creating property:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// GET /api/properties/:id/holders - Get token holders for a property
router.get('/:id/holders', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT p.stellar_address, po.token_balance FROM portfolio po
       JOIN users p ON po.user_id = p.id
       WHERE po.property_id = $1 AND po.token_balance > 0
       ORDER BY po.token_balance DESC`,
      [id]
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (err) {
    logger.error('Error fetching holders:', err);
    res.status(500).json({ error: 'Failed to fetch holders' });
  }
});

export default router;
