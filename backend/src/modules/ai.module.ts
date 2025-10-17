import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from '../controllers/ai.controller';
import { AiTextService } from '../services/aiText.service';
import { AiImageService } from '../services/aiImage.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiTextService, AiImageService],
  exports: [AiTextService, AiImageService],
})
export class AiModule {}
