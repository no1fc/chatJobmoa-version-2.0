import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePostingDto, UpdatePostingDto } from '../dto/posting.dto';

export interface PostingListResponse {
  data: Array<{
    id: string;
    title: string;
    status: string;
    updatedAt: Date;
  }>;
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}

@Injectable()
export class PostingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createPostingDto: CreatePostingDto) {
    const posting = await this.prisma.jobPosting.create({
      data: {
        title: createPostingDto.title,
        userId,
        status: 'DRAFT',
      },
    });

    return posting;
  }

  async findAllByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<PostingListResponse> {
    const skip = (page - 1) * limit;

    const [postings, totalItems] = await Promise.all([
      this.prisma.jobPosting.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
        },
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      this.prisma.jobPosting.count({ where: { userId } }),
    ]);

    return {
      data: postings,
      meta: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const posting = await this.prisma.jobPosting.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!posting) {
      throw new NotFoundException('Project not found.');
    }

    return posting;
  }

  async update(id: string, userId: string, updatePostingDto: UpdatePostingDto) {
    // 소유권 확인
    await this.findOne(id, userId);

    const updatedPosting = await this.prisma.jobPosting.update({
      where: { id },
      data: updatePostingDto,
    });

    return updatedPosting;
  }

  async remove(id: string, userId: string) {
    // 소유권 확인
    await this.findOne(id, userId);

    await this.prisma.jobPosting.delete({
      where: { id },
    });

    return;
  }
}
