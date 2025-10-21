import { Request, Response } from 'express';
import { SystemHealthCheck } from '@health/system-health.check.js';
import { FirestoreHealthCheck } from '@health/firestore-health.check.js';
import { logger } from '@utils/logger.js';

export async function healthHandler(_req: Request, res: Response) {
  const systemCheck = new SystemHealthCheck();
  const firestoreCheck = new FirestoreHealthCheck();

  const [system, firestore] = await Promise.all([
    systemCheck.check(),
    firestoreCheck.check()
  ]);

  const overallStatus = deriveOverallStatus(system.status, firestore.status);
  logger.info({ msg: 'health_check', overallStatus });
  return res.json({ status: overallStatus, checks: { system, firestore } });
}

function deriveOverallStatus(sys: string, db: string) {
  if (sys === 'Unhealthy' || db === 'Unhealthy') return 'Unhealthy';
  if (sys === 'Warning' || db === 'Warning') return 'Warning';
  return 'Healthy';
}
