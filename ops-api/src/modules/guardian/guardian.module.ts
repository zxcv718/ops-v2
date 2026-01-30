import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/index.js';
import { GuardianRepository } from './guardian.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [GuardianRepository],
  exports: [GuardianRepository],
})
export class GuardianModule {}
