import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenerationController } from '../controllers/generation.controller';
import { GenerationService } from '../services/generation.service';
import { PrismaService } from '../services/prisma.service';
import { PostingModule } from './posting.module';
import { SmeBenefitModule } from './smeBenefit.module';
import { AiModule } from './ai.module';

@Module({
  imports: [ConfigModule, PostingModule, SmeBenefitModule, AiModule],
  controllers: [GenerationController],
  providers: [GenerationService, PrismaService],
})
export class GenerationModule {}
