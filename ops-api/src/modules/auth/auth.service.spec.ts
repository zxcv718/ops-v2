import { describe, it, expect, beforeEach } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  createMockUser,
  createMockUserWithoutPassword,
  resetUserCounter,
} from '../../../test/factories/index.js';
import {
  createMockPrismaService,
  createMockJwtService,
} from '../../../test/utils/test-helper.js';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;
  let mockJwtService: ReturnType<typeof createMockJwtService>;

  beforeEach(async () => {
    resetUserCounter();
    mockPrismaService = createMockPrismaService();
    mockJwtService = createMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = createMockUser({
        email: 'test@example.com',
        password: hashedPassword,
      });

      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      const result = await service.validateUser(
        'notfound@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = createMockUser({
        email: 'test@example.com',
        password: hashedPassword,
      });

      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = createMockUserWithoutPassword({
        email: 'test@example.com',
      });

      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(user);

      expect(result).toHaveProperty('accessToken', 'access-token');
      expect(result).toHaveProperty('refreshToken', 'refresh-token');
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const mockPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: 'USER',
      };

      mockJwtService.verifyAsync.mockResolvedValueOnce(mockPayload);
      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refreshTokens('valid-refresh-token');

      expect(result).toHaveProperty('accessToken', 'new-access-token');
      expect(result).toHaveProperty('refreshToken', 'new-refresh-token');
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        'valid-refresh-token',
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', () => {
      mockJwtService.verifyAsync.mockRejectedValueOnce(
        new Error('Invalid token'),
      );

      expect(service.refreshTokens('invalid-refresh-token')).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });
  });

  describe('getUserById', () => {
    it('should return user without password when user exists', async () => {
      const mockUser = createMockUser({ id: 'user-1' });

      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.getUserById('user-1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('user-1');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      const result = await service.getUserById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
