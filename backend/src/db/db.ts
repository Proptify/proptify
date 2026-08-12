import pg from 'pg';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export const initDB = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not set in .env');
  }

  pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    logger.info('✓ Database connected:', res.rows[0]);
    client.release();
  } catch (err) {
    logger.error('❌ Database connection failed:', err);
    throw err;
  }

  // Run migrations
  await runMigrations();
};

const runMigrations = async () => {
  if (!pool) throw new Error('Database not initialized');

  const migrations = [
    `
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        description TEXT,
        property_type VARCHAR(50),
        total_tokens BIGINT NOT NULL,
        price_per_token NUMERIC(19,8) NOT NULL,
        contract_id VARCHAR(56),
        admin_address VARCHAR(56),
        apy NUMERIC(5,2),
        funded_percentage INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stellar_address VARCHAR(56) UNIQUE NOT NULL,
        kyc_status VARCHAR(50) DEFAULT 'pending',
        kyc_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        property_id UUID REFERENCES properties(id),
        tx_type VARCHAR(50) NOT NULL,
        amount BIGINT NOT NULL,
        tx_hash VARCHAR(256),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS portfolio (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) NOT NULL,
        property_id UUID REFERENCES properties(id) NOT NULL,
        token_balance BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, property_id)
      );
    `,
  ];

  for (const migration of migrations) {
    try {
      await pool.query(migration);
    } catch (err: any) {
      if (!err.message.includes('already exists')) {
        logger.warn('Migration warning:', err.message);
      }
    }
  }

  logger.info('✓ Database migrations complete');
};

export const query = async (text: string, params?: any[]) => {
  if (!pool) throw new Error('Database not initialized');
  return pool.query(text, params);
};

export const getClient = async () => {
  if (!pool) throw new Error('Database not initialized');
  return pool.connect();
};
