import {
  Injectable,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface GeneratedImagePaths {
  posterPath: string;
  bannerPath: string;
}

@Injectable()
export class AiImageService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable not set. Gemini API calls will fail.');
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async generatePosterAndBanner(
    postingData: Record<string, unknown>,
  ): Promise<GeneratedImagePaths> {
    try {
      // Google AI SDK를 사용한 이미지 생성
      const ai = this.ai;

      // 포스터 프롬프트 (세로형)
      const posterPrompt = `Create a professional recruitment poster with the following details:
- Company: ${postingData.companyName || 'Company Name'}
- Position: ${postingData.position || 'Job Position'}
- Color tone: ${postingData.colorTone || 'blue'}
- Style: ${postingData.styleConcept || 'professional'}
Design a vertical portrait poster that is clean and professional.`;

      // 배너 프롬프트 (가로형)
      const bannerPrompt = `Create a professional recruitment web banner with the following details:
- Company: ${postingData.companyName || 'Company Name'}
- Position: ${postingData.position || 'Job Position'}
- Color tone: ${postingData.colorTone || 'blue'}
- Style: ${postingData.styleConcept || 'professional'}
Design a horizontal landscape banner suitable for a website header.`;

      // 이미지 저장 디렉토리 생성
      const postingId = (postingData.id as string) || 'unknown';
      const uploadDir = path.join(
        process.cwd(),
        'uploads',
        'postings',
        postingId,
      );
      await fs.mkdir(uploadDir, { recursive: true });

      // 현재 시간 기준 파일명 생성
      const timestamp = Date.now();
      const posterFilename = `poster-${timestamp}.jpg`;
      const bannerFilename = `banner-${timestamp}.jpg`;

      const posterPath = path.join(uploadDir, posterFilename);
      const bannerPath = path.join(uploadDir, bannerFilename);

      // 포스터 이미지 생성 (16:9 aspect ratio for vertical poster)
      const posterResponse: any = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: posterPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '9:16', // 세로형
        },
      });

      // 배너 이미지 생성 (16:9 aspect ratio for horizontal banner)
      const bannerResponse: any = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: bannerPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9', // 가로형
        },
      });

      // 포스터 이미지 저장
      if (posterResponse.predictions && posterResponse.predictions.length > 0) {
        const posterImageData = posterResponse.predictions[0].bytesBase64Encoded;
        if (posterImageData) {
          const posterBuffer = Buffer.from(posterImageData, 'base64');
          await fs.writeFile(posterPath, posterBuffer);
        } else {
          throw new Error('No poster image data found in response');
        }
      } else {
        throw new Error('No poster image generated');
      }

      // 배너 이미지 저장
      if (bannerResponse.predictions && bannerResponse.predictions.length > 0) {
        const bannerImageData = bannerResponse.predictions[0].bytesBase64Encoded;
        if (bannerImageData) {
          const bannerBuffer = Buffer.from(bannerImageData, 'base64');
          await fs.writeFile(bannerPath, bannerBuffer);
        } else {
          throw new Error('No banner image data found in response');
        }
      } else {
        throw new Error('No banner image generated');
      }

      return {
        posterPath: `/uploads/postings/${postingId}/${posterFilename}`,
        bannerPath: `/uploads/postings/${postingId}/${bannerFilename}`,
      };
    } catch (error: unknown) {
      console.error('AI image generation error:', error);
      if (error instanceof Error) {
        if (error.message.includes('API') || error.message.includes('imagen')) {
          throw new ServiceUnavailableException('AI image generation failed: ' + error.message);
        }
      }
      throw new InternalServerErrorException('Failed to generate or save images.');
    }
  }
}
