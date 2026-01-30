import { describe, it, expect, beforeEach } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('GET /health', () => {
    it('should return health status with status ok', () => {
      const result = controller.check();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', () => {
      const result = controller.live();

      expect(result).toHaveProperty('status', 'ok');
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', () => {
      const result = controller.ready();

      expect(result).toHaveProperty('status', 'ok');
    });
  });
});
