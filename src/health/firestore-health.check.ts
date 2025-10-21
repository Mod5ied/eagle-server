import BaseHealthCheck from '@health/base-health.check.js';
import { HealthStatus } from '@health/health-status.enum.js';
import { HealthCheckResultDto } from '@health/health-check-result.dto.js';
import { db } from '@config/firebase.js';

export class FirestoreHealthCheck extends BaseHealthCheck {
  name(): string { return 'firestore'; }
  displayName(): string { return 'Firestore Connectivity'; }
  description(): string { return 'Verifies Firestore read access and latency'; }
  tags(): string[] { return ['core', 'database', 'firestore']; }

  async check(): Promise<HealthCheckResultDto> {
    this.begin();
    try {
      const start = Date.now();
      // Lightweight read: fetch zero documents (limit 1) from products collection.
      const snap = await db.collection('products').limit(1).get();
      const latency = Date.now() - start;
      const metrics = {
        latencyMs: latency,
        timestamp: new Date().toISOString(),
        reachable: true,
        docCountSample: snap.size
      };
      return this.result(HealthStatus.HEALTHY, metrics);
    } catch (e) {
      return this.fail(e as Error);
    }
  }
}
