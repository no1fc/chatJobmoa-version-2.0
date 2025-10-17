import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiTextService } from '../services/aiText.service';
import { RecommendKeywordsDto } from '../dto/ai.dto';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private readonly aiTextService: AiTextService) {}

  @Post('recommend/keywords')
  async recommendKeywords(@Body() dto: RecommendKeywordsDto) {
    return this.aiTextService.recommendKeywords(dto.jobType, dto.position);
  }
}
