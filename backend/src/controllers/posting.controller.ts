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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  @Post(':id/logo-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/logos',
        filename: (req, file, cb) => {
          const postingId = req.params.id;
          const timestamp = Date.now();
          const ext = extname(file.originalname);
          cb(null, `${postingId}-${timestamp}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Invalid file type.'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadLogo(
    @Request() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    const userId = req.user.userId;
    return this.postingService.uploadLogo(id, userId, file);
  }
}
