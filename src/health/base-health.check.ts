import { HealthStatus } from './health-status.enum.js';
import { HealthCheckInterface } from './health-check.interface.js';
import { HealthCheckResultDto } from './health-check-result.dto.js';

abstract class BaseHealthCheck implements HealthCheckInterface {
  protected startTime = 0;

  abstract name(): string;
  abstract check(): Promise<HealthCheckResultDto>;

  displayName?(): string { return this.name(); }
  description?(): string { return `Health check for ${this.name()}`; }
  tags?(): string[] { return ['health-check']; }

  protected begin() { this.startTime = Date.now(); }
  protected responseTime(): number { return Date.now() - this.startTime; }

  protected result(status: HealthStatus, metrics: Record<string, any> = {}, message?: string): HealthCheckResultDto {
    return new HealthCheckResultDto(
      this.name(),
      status,
      this.responseTime(),
      message,
      metrics,
      this.displayName?.(),
      this.description?.(),
      this.tags?.()
    );
  }

  protected fail(error: Error): HealthCheckResultDto {
    return this.result(HealthStatus.UNHEALTHY, { error: error.message }, error.message);
  }
}

export default BaseHealthCheck;
