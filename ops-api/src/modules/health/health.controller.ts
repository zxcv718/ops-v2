import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service.js';
import type { HealthStatus } from './health.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({ summary: '전체 헬스체크' })
  @ApiResponse({ status: 200, description: '서비스 상태 정보' })
  @Get()
  check(): HealthStatus {
    return this.healthService.check();
  }

  @ApiOperation({ summary: 'Liveness 체크' })
  @ApiResponse({ status: 200, description: '서비스 생존 여부' })
  @Get('live')
  live(): Pick<HealthStatus, 'status'> {
    return this.healthService.live();
  }

  @ApiOperation({ summary: 'Readiness 체크' })
  @ApiResponse({ status: 200, description: '서비스 준비 상태' })
  @Get('ready')
  ready(): Pick<HealthStatus, 'status'> {
    return this.healthService.ready();
  }
}
