import BaseHealthCheck from '@health/base-health.check.js';
import { HealthStatus } from '@health/health-status.enum.js';
import { HealthCheckResultDto } from '@health/health-check-result.dto.js';
import os from 'os';

export class SystemHealthCheck extends BaseHealthCheck {
  name(): string { return 'system'; }
  displayName(): string { return 'System Resources'; }
  description(): string { return 'Checks system resources including CPU, memory, and load averages'; }
  tags(): string[] { return ['core', 'system', 'resources']; }

  async check(): Promise<HealthCheckResultDto> {
    this.begin();
    try {
      const memory = this.memoryMetrics();
      const cpu = this.cpuMetrics();
      const metrics = {
        memory,
        cpu,
        load: os.loadavg(),
        uptime: os.uptime(),
        platform: {
          type: os.type(),
          platform: os.platform(),
          release: os.release(),
          arch: os.arch()
        }
      };
      const memoryUsagePercent = parseFloat(memory.usagePercent);
      const cpuUsagePercent = parseFloat(cpu.usagePercent);
      let status = HealthStatus.HEALTHY;
      let message: string | undefined;
      if (memoryUsagePercent > 90 || cpuUsagePercent > 90) {
        status = HealthStatus.WARNING;
        message = 'High resource usage detected';
      }
      return this.result(status, metrics, message);
    } catch (e) {
      return this.fail(e as Error);
    }
  }

  private memoryMetrics() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    return { total, used, free, usagePercent: ((used / total) * 100).toFixed(2) };
  }

  private cpuMetrics() {
    const cpus = os.cpus();
    const avgIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0) / cpus.length;
    const avgTotal = cpus.reduce((acc, cpu) => acc + Object.values(cpu.times).reduce((sum, val) => sum + val, 0), 0) / cpus.length;
    return {
      count: cpus.length,
      model: cpus[0].model,
      speed: cpus[0].speed,
      usagePercent: (100 - (avgIdle / avgTotal) * 100).toFixed(2),
      load: os.loadavg()
    };
  }
}
