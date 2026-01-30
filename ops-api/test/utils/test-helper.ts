import { mock } from 'bun:test';

/**
 * PrismaService mock 생성
 */
export function createMockPrismaService() {
  return {
    user: {
      findUnique: mock(() => null),
      findMany: mock(() => []),
      create: mock(() => null),
      update: mock(() => null),
      delete: mock(() => null),
    },
    guardian: {
      findUnique: mock(() => null),
      findMany: mock(() => []),
      create: mock(() => null),
      update: mock(() => null),
      delete: mock(() => null),
    },
    ward: {
      findUnique: mock(() => null),
      findMany: mock(() => []),
      create: mock(() => null),
      update: mock(() => null),
      delete: mock(() => null),
    },
    call: {
      findUnique: mock(() => null),
      findMany: mock(() => []),
      create: mock(() => null),
      update: mock(() => null),
      delete: mock(() => null),
    },
    transcript: {
      findUnique: mock(() => null),
      findMany: mock(() => []),
      create: mock(() => null),
      createMany: mock(() => ({ count: 0 })),
      delete: mock(() => null),
    },
    callSummary: {
      findUnique: mock(() => null),
      create: mock(() => null),
      update: mock(() => null),
      upsert: mock(() => null),
    },
  };
}

/**
 * JwtService mock 생성
 */
export function createMockJwtService() {
  return {
    signAsync: mock(() => Promise.resolve('mock-token')),
    verifyAsync: mock(() => Promise.resolve({ sub: 'user-id' })),
    sign: mock(() => 'mock-token'),
    verify: mock(() => ({ sub: 'user-id' })),
  };
}

/**
 * ConfigService mock 생성
 */
export function createMockConfigService(config: Record<string, unknown> = {}) {
  return {
    get: mock(
      (key: string, defaultValue?: unknown) => config[key] ?? defaultValue,
    ),
    getOrThrow: mock((key: string) => {
      if (key in config) return config[key];
      throw new Error(`Config key "${key}" not found`);
    }),
  };
}
