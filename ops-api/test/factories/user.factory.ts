import type { User, Role } from '@prisma/client';

export interface CreateUserOptions {
  id?: string;
  email?: string;
  password?: string;
  name?: string | null;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

let userCounter = 0;

export function createMockUser(options: CreateUserOptions = {}): User {
  userCounter++;
  const now = new Date();

  return {
    id: options.id ?? `user-${userCounter}`,
    email: options.email ?? `user${userCounter}@example.com`,
    password: options.password ?? 'hashed-password',
    name: options.name ?? `Test User ${userCounter}`,
    role: options.role ?? 'USER',
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  };
}

export function createMockUserWithoutPassword(
  options: CreateUserOptions = {},
): Omit<User, 'password'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...user } = createMockUser(options);
  return user;
}

export function resetUserCounter(): void {
  userCounter = 0;
}
