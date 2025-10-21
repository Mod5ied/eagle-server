export class HealthCheckResultDto {
  constructor(
    public name: string,
    public status: 'Healthy' | 'Unhealthy' | 'Warning',
    public responseTime: number,
    public error?: string,
    public metrics?: Record<string, any>,
    public displayName?: string,
    public description?: string,
    public tags?: string[]
  ) {}
}
