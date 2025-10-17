import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostingService } from '../services/posting.service';
import {
  CreatePostingDto,
  UpdatePostingDto,
  GetPostingsQueryDto,
} from '../dto/posting.dto';

@Controller('postings')
@UseGuards(AuthGuard('jwt'))
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: any, @Body() createPostingDto: CreatePostingDto) {
    const userId = req.user.userId;
    return this.postingService.create(userId, createPostingDto);
  }

  @Get()
  async findAll(@Request() req: any, @Query() query: GetPostingsQueryDto) {
    const userId = req.user.userId;
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';

    return this.postingService.findAllByUser(userId, page, limit, sortBy, order);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.postingService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updatePostingDto: UpdatePostingDto,
  ) {
    const userId = req.user.userId;
    return this.postingService.update(id, userId, updatePostingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.postingService.remove(id, userId);
  }
}
