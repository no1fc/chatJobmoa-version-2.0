import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { PostingService } from './posting.service';
import { SmeBenefitService } from './smeBenefit.service';
import { AiTextService } from './aiText.service';
import { AiImageService } from './aiImage.service';

@Injectable()
export class GenerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postingService: PostingService,
    private readonly smeBenefitService: SmeBenefitService,
    private readonly aiTextService: AiTextService,
    private readonly aiImageService: AiImageService,
    private readonly configService: ConfigService,
  ) {}

  async generateImages(postingId: string, userId: string) {
    // 소유권 확인 및 프로젝트 조회
    const posting = await this.postingService.findOne(postingId, userId);

    // 필수 필드 검증
    if (!posting.position || !posting.companyName) {
      throw new BadRequestException('Missing required fields for generation.');
    }

    // AI 이미지 생성
    const { posterPath, bannerPath } =
      await this.aiImageService.generatePosterAndBanner(posting);

    // 서버 URL 생성
    const baseUrl =
      this.configService.get<string>('SERVER_URL') || 'http://localhost:3056';
    const posterUrl = `${baseUrl}${posterPath}`;
    const bannerUrl = `${baseUrl}${bannerPath}`;

    // DB 업데이트
    const updatedPosting = await this.prisma.jobPosting.update({
      where: { id: postingId },
      data: {
        generatedPosterUrl: posterUrl,
        generatedBannerUrl: bannerUrl,
      },
    });

    return updatedPosting;
  }

  async generateHtml(postingId: string, userId: string) {
    // 소유권 확인 및 프로젝트 조회
    const posting = await this.postingService.findOne(postingId, userId);

    // 필수 필드 검증
    if (!posting.position || !posting.companyIntro) {
      throw new BadRequestException('Missing required fields for generation.');
    }

    // 선택된 혜택 정보 조회
    let benefits: Array<Record<string, unknown>> = [];
    if (posting.selectedBenefitsJson) {
      try {
        const benefitIds = JSON.parse(posting.selectedBenefitsJson) as string[];
        if (benefitIds.length > 0) {
          const benefitData =
            await this.smeBenefitService.findBenefitsByIds(benefitIds);
          benefits = benefitData.map((b) => ({
            id: b.id,
            name: b.name,
            description: b.description,
            sourceUrl: b.sourceUrl,
          }));
        }
      } catch (error: unknown) {
        throw new BadRequestException('Invalid selectedBenefitsJson format.');
      }
    }

    // AI HTML 생성
    const html = await this.aiTextService.generateHtml(posting, benefits);

    // DB 업데이트
    const updatedPosting = await this.prisma.jobPosting.update({
      where: { id: postingId },
      data: {
        generatedHtml: html,
      },
    });

    return updatedPosting;
  }
}
