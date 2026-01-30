import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { Guardian, Prisma } from '@prisma/client';

@Injectable()
export class GuardianRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.GuardianCreateInput): Promise<Guardian> {
    return this.prisma.guardian.create({ data });
  }

  async findById(id: string): Promise<Guardian | null> {
    return this.prisma.guardian.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Guardian | null> {
    return this.prisma.guardian.findUnique({ where: { userId } });
  }

  async findAll(): Promise<Guardian[]> {
    return this.prisma.guardian.findMany();
  }

  async update(
    id: string,
    data: Prisma.GuardianUpdateInput,
  ): Promise<Guardian> {
    return this.prisma.guardian.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Guardian> {
    return this.prisma.guardian.delete({ where: { id } });
  }

  async findWithWards(
    id: string,
  ): Promise<(Guardian & { wards: unknown[] }) | null> {
    return this.prisma.guardian.findUnique({
      where: { id },
      include: { wards: true },
    });
  }
}
