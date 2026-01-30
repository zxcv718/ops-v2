import type { Guardian } from '@prisma/client';

export interface CreateGuardianOptions {
  id?: string;
  userId?: string;
  phoneNumber?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

let guardianCounter = 0;

export function createMockGuardian(
  options: CreateGuardianOptions = {},
): Guardian {
  guardianCounter++;
  const now = new Date();

  return {
    id: options.id ?? `guardian-${guardianCounter}`,
    userId: options.userId ?? `user-${guardianCounter}`,
    phoneNumber:
      options.phoneNumber ??
      `010-1234-${String(guardianCounter).padStart(4, '0')}`,
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  };
}

export function resetGuardianCounter(): void {
  guardianCounter = 0;
}
