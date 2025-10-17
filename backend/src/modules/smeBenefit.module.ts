import { Module } from '@nestjs/common';
import { SmeBenefitController } from '../controllers/smeBenefit.controller';
import { SmeBenefitService } from '../services/smeBenefit.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [SmeBenefitController],
  providers: [SmeBenefitService, PrismaService],
  exports: [SmeBenefitService],
})
export class SmeBenefitModule {}
