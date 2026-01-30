import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { Call, CallStatus, Prisma } from '@prisma/client';

@Injectable()
export class CallRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CallCreateInput): Promise<Call> {
    return this.prisma.call.create({ data });
  }

  async findById(id: string): Promise<Call | null> {
    return this.prisma.call.findUnique({ where: { id } });
  }

  async findByWardId(wardId: string): Promise<Call[]> {
    return this.prisma.call.findMany({
      where: { wardId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: CallStatus): Promise<Call[]> {
    return this.prisma.call.findMany({ where: { status } });
  }

  async findAll(): Promise<Call[]> {
    return this.prisma.call.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, data: Prisma.CallUpdateInput): Promise<Call> {
    return this.prisma.call.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Call> {
    return this.prisma.call.delete({ where: { id } });
  }

  async findWithTranscripts(
    id: string,
  ): Promise<(Call & { transcripts: unknown[] }) | null> {
    return this.prisma.call.findUnique({
      where: { id },
      include: { transcripts: true, summary: true },
    });
  }

  async findRecentByWardId(wardId: string, limit: number): Promise<Call[]> {
    return this.prisma.call.findMany({
      where: { wardId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
