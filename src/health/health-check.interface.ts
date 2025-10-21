import { HealthCheckResultDto } from './health-check-result.dto.js';

export interface HealthCheckInterface {
  name(): string;
  check(): Promise<HealthCheckResultDto>;
  displayName?(): string;
  description?(): string;
  tags?(): string[];
}
