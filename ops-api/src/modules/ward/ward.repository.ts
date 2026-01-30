import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { Ward, Prisma } from '@prisma/client';

@Injectable()
export class WardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.WardCreateInput): Promise<Ward> {
    return this.prisma.ward.create({ data });
  }

  async findById(id: string): Promise<Ward | null> {
    return this.prisma.ward.findUnique({ where: { id } });
  }

  async findByGuardianId(guardianId: string): Promise<Ward[]> {
    return this.prisma.ward.findMany({ where: { guardianId } });
  }

  async findAll(): Promise<Ward[]> {
    return this.prisma.ward.findMany();
  }

  async update(id: string, data: Prisma.WardUpdateInput): Promise<Ward> {
    return this.prisma.ward.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Ward> {
    return this.prisma.ward.delete({ where: { id } });
  }

  async findWithCalls(
    id: string,
  ): Promise<(Ward & { calls: unknown[] }) | null> {
    return this.prisma.ward.findUnique({
      where: { id },
      include: { calls: true },
    });
  }
}
