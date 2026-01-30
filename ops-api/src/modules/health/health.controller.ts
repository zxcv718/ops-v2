import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';
import type { HealthStatus } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): HealthStatus {
    return this.healthService.check();
  }

  @Get('live')
  live(): Pick<HealthStatus, 'status'> {
    return this.healthService.live();
  }

  @Get('ready')
  ready(): Pick<HealthStatus, 'status'> {
    return this.healthService.ready();
  }
}
