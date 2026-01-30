import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { Transcript, Prisma } from '@prisma/client';

@Injectable()
export class TranscriptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TranscriptCreateInput): Promise<Transcript> {
    return this.prisma.transcript.create({ data });
  }

  async createMany(data: Prisma.TranscriptCreateManyInput[]): Promise<number> {
    const result = await this.prisma.transcript.createMany({ data });
    return result.count;
  }

  async findById(id: string): Promise<Transcript | null> {
    return this.prisma.transcript.findUnique({ where: { id } });
  }

  async findByCallId(callId: string): Promise<Transcript[]> {
    return this.prisma.transcript.findMany({
      where: { callId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async delete(id: string): Promise<Transcript> {
    return this.prisma.transcript.delete({ where: { id } });
  }

  async deleteByCallId(callId: string): Promise<number> {
    const result = await this.prisma.transcript.deleteMany({
      where: { callId },
    });
    return result.count;
  }
}
