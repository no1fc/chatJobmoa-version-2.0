import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SmeBenefitService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveBenefits() {
    try {
      return await this.prisma.smeBenefit.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to fetch benefits.');
    }
  }

  async findBenefitsByIds(ids: string[]) {
    try {
      return await this.prisma.smeBenefit.findMany({
        where: {
          id: { in: ids },
          isActive: true,
        },
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to fetch benefits by IDs.');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncBenefits() {
    try {
      // 외부 공공 API 호출 로직 (추후 구현)
      // 현재는 로그만 출력
      console.log('Syncing SME benefits...');

      // 예시 데이터 생성 (실제로는 외부 API에서 데이터를 가져옴)
      const exampleBenefits = [
        {
          name: '청년내일채움공제',
          description: '중소기업에 취업한 청년을 대상으로 장기재직을 지원하는 정책',
          sourceUrl: 'https://www.work.go.kr',
          isActive: true,
        },
        {
          name: '중소기업 취업자 소득세 감면',
          description: '중소기업 취업 청년에게 소득세 90% 감면 혜택 제공',
          sourceUrl: 'https://www.nts.go.kr',
          isActive: true,
        },
      ];

      // 데이터베이스 동기화 로직
      for (const benefit of exampleBenefits) {
        const existing = await this.prisma.smeBenefit.findFirst({
          where: { name: benefit.name },
        });

        if (existing) {
          await this.prisma.smeBenefit.update({
            where: { id: existing.id },
            data: benefit,
          });
        } else {
          await this.prisma.smeBenefit.create({
            data: benefit,
          });
        }
      }

      console.log('SME benefits sync completed.');
    } catch (error: unknown) {
      console.error('Failed to sync SME benefits:', error);
    }
  }
}
