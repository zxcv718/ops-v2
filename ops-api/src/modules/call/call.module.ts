import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/index.js';
import { CallRepository } from './call.repository.js';
import { TranscriptRepository } from './transcript.repository.js';
import { CallSummaryRepository } from './call-summary.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [CallRepository, TranscriptRepository, CallSummaryRepository],
  exports: [CallRepository, TranscriptRepository, CallSummaryRepository],
})
export class CallModule {}
