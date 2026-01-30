import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: mock(() => null),
    login: mock(() =>
      Promise.resolve({ accessToken: 'at', refreshToken: 'rt' }),
    ),
    refreshTokens: mock(() =>
      Promise.resolve({ accessToken: 'new-at', refreshToken: 'new-rt' }),
    ),
    getUserById: mock(() => null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('POST /auth/login', () => {
    it('should return tokens for valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.validateUser.mockResolvedValueOnce(mockUser);
      mockAuthService.login.mockResolvedValueOnce({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken', 'access-token');
      expect(result).toHaveProperty('refreshToken', 'refresh-token');
    });

    it('should throw UnauthorizedException for invalid credentials', () => {
      mockAuthService.validateUser.mockResolvedValueOnce(null);

      expect(
        controller.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow();
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return new tokens', async () => {
      mockAuthService.refreshTokens.mockResolvedValueOnce({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });

      const result = await controller.refresh({ refreshToken: 'old-token' });

      expect(result).toHaveProperty('accessToken', 'new-access');
      expect(result).toHaveProperty('refreshToken', 'new-refresh');
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.getUserById.mockResolvedValueOnce(mockUser);

      const req = { user: { sub: 'user-1' } };
      const result = await controller.me(req);

      expect(result).toHaveProperty('email', 'test@example.com');
    });

    it('should throw UnauthorizedException if user not found', () => {
      mockAuthService.getUserById.mockResolvedValueOnce(null);

      const req = { user: { sub: 'not-exist' } };

      expect(controller.me(req)).rejects.toThrow();
    });
  });

  describe('POST /auth/logout', () => {
    it('should return success message', () => {
      const result = controller.logout();
      expect(result).toHaveProperty('message');
    });
  });
});
