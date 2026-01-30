import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime?: number;
}

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  check(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  live(): Pick<HealthStatus, 'status'> {
    return { status: 'ok' };
  }

  ready(): Pick<HealthStatus, 'status'> {
    return { status: 'ok' };
  }
}
