import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const contractIds = {
    propertyToken: process.env.CONTRACT_PROPERTY_TOKEN || 'NOT_SET',
    rentDistributor: process.env.CONTRACT_RENT_DISTRIBUTOR || 'NOT_SET',
    installmentSale: process.env.CONTRACT_INSTALLMENT_SALE || 'NOT_SET',
    titleRegistry: process.env.CONTRACT_TITLE_REGISTRY || 'NOT_SET',
    coOwnershipDao: process.env.CONTRACT_CO_OWNERSHIP_DAO || 'NOT_SET',
    compliance: process.env.CONTRACT_COMPLIANCE || 'NOT_SET',
    oracle: process.env.CONTRACT_ORACLE || 'NOT_SET',
    escrow: process.env.CONTRACT_ESCROW || 'NOT_SET',
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    network: process.env.STELLAR_NETWORK || 'testnet',
    adminAccount: process.env.ADMIN_PUBLIC_KEY || 'NOT_SET',
    contracts: contractIds,
    api: {
      properties: '/api/properties',
      auth: '/api/auth',
    },
  });
});

export default router;
