import { Module } from '@nestjs/common';
import { PostingController } from '../controllers/posting.controller';
import { PostingService } from '../services/posting.service';
import { PrismaService } from '../services/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PostingController],
  providers: [PostingService, PrismaService],
  exports: [PostingService],
})
export class PostingModule {}
