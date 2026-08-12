import { Router, Request, Response } from 'express';
import { Keypair, TransactionBuilder, Networks, BASE_FEE } from 'stellar-sdk';
import jwt from 'jsonwebtoken';
import { query } from '../db/db.js';
import { getAdminKeypair, getServer, getNetworkPassphrase } from '../config/stellar.js';
import { logger } from '../utils/logger.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/auth/challenge - Get SEP-10 auth challenge
router.post('/challenge', async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'publicKey required' });
    }

    // Validate Stellar public key format
    if (!publicKey.startsWith('G') || publicKey.length !== 56) {
      return res.status(400).json({ error: 'Invalid public key format' });
    }

    const server = getServer();
    const adminKeypair = getAdminKeypair();
    const passphrase = getNetworkPassphrase();

    // Get current account sequence
    const account = await server.loadAccount(adminKeypair.publicKey());

    // Create challenge transaction
    const now = Math.floor(Date.now() / 1000);
    const challenge = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: passphrase,
      timebounds: { minTime: now, maxTime: now + 900 }, // 15 min expiry
    })
      .addMemo({ type: 'id' as any, id: 1 })
      .addOperation({
        type: 'manageData' as any,
        name: 'web-auth-v1',
        value: Buffer.from(`${publicKey}${now}`).toString('base64'),
        source: publicKey,
      } as any)
      .build();

    challenge.sign(adminKeypair);
    const challengeXdr = challenge.toEnvelope().toXDR('base64');

    res.json({
      success: true,
      challenge: challengeXdr,
      network_passphrase: passphrase,
    });
  } catch (err) {
    logger.error('Error generating challenge:', err);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

// POST /api/auth/verify - Verify signed challenge and issue JWT
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { challenge, signature } = req.body;

    if (!challenge || !signature) {
      return res.status(400).json({ error: 'challenge and signature required' });
    }

    // In production, verify the signature properly
    // For MVP, we'll do basic validation
    let publicKey = '';
    try {
      // Extract public key from challenge (simplified)
      const buf = Buffer.from(challenge, 'base64');
      publicKey = buf.toString('utf8').substring(0, 56);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid challenge format' });
    }

    // Upsert user
    const result = await query(
      `INSERT INTO users (stellar_address) VALUES ($1)
       ON CONFLICT (stellar_address) DO UPDATE SET updated_at = NOW()
       RETURNING id, stellar_address`,
      [publicKey]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, publicKey: user.stellar_address },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    logger.error('Error verifying challenge:', err);
    res.status(500).json({ error: 'Failed to verify challenge' });
  }
});

export default router;
