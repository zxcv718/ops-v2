import type { Ward } from '@prisma/client';

export interface CreateWardOptions {
  id?: string;
  guardianId?: string;
  name?: string;
  phoneNumber?: string;
  birthDate?: Date | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

let wardCounter = 0;

export function createMockWard(options: CreateWardOptions = {}): Ward {
  wardCounter++;
  const now = new Date();

  return {
    id: options.id ?? `ward-${wardCounter}`,
    guardianId: options.guardianId ?? `guardian-${wardCounter}`,
    name: options.name ?? `피보호자 ${wardCounter}`,
    phoneNumber:
      options.phoneNumber ?? `010-5678-${String(wardCounter).padStart(4, '0')}`,
    birthDate: options.birthDate ?? new Date('1940-01-01'),
    notes: options.notes ?? null,
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  };
}

export function resetWardCounter(): void {
  wardCounter = 0;
}
