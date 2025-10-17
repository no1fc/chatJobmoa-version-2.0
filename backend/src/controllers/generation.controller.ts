import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenerationService } from '../services/generation.service';

@Controller('generate')
@UseGuards(AuthGuard('jwt'))
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post(':id/images')
  async generateImages(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.generationService.generateImages(id, userId);
  }

  @Post(':id/html')
  async generateHtml(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.generationService.generateHtml(id, userId);
  }
}
