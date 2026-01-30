import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CallSummary, Prisma } from '@prisma/client';

@Injectable()
export class CallSummaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CallSummaryCreateInput): Promise<CallSummary> {
    return this.prisma.callSummary.create({ data });
  }

  async findById(id: string): Promise<CallSummary | null> {
    return this.prisma.callSummary.findUnique({ where: { id } });
  }

  async findByCallId(callId: string): Promise<CallSummary | null> {
    return this.prisma.callSummary.findUnique({ where: { callId } });
  }

  async update(
    id: string,
    data: Prisma.CallSummaryUpdateInput,
  ): Promise<CallSummary> {
    return this.prisma.callSummary.update({ where: { id }, data });
  }

  async upsertByCallId(
    callId: string,
    data: Omit<Prisma.CallSummaryCreateInput, 'call'>,
  ): Promise<CallSummary> {
    return this.prisma.callSummary.upsert({
      where: { callId },
      create: { ...data, call: { connect: { id: callId } } },
      update: data,
    });
  }

  async delete(id: string): Promise<CallSummary> {
    return this.prisma.callSummary.delete({ where: { id } });
  }
}
