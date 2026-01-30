import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/index.js';
import { WardRepository } from './ward.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [WardRepository],
  exports: [WardRepository],
})
export class WardModule {}
