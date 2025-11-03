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
  private readonly ai: GoogleGenAI;

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

/*      // 포스터 프롬프트 (세로형)
      const posterPrompt = `Create a professional recruitment poster with the following details:
- Company: ${postingData.companyName || 'Company Name'}
- Position: ${postingData.position || 'Job Position'}
- Color tone: ${postingData.colorTone || 'blue'}
- Style: ${postingData.styleConcept || 'professional'}
Design a vertical portrait poster that is clean and professional.`;*/

      // 포스터 프롬프트 (세로형)
      const posterPrompt = `a 9:16 aspect ratio, vibrant and dynamic human infographic **vertical poster**, specifically designed for a **Korean SME (Small and Medium-sized Enterprise) recruitment advertisement**, targeting 20s-30s Korean professionals.

The scene features **at least two, predominantly Korean professional figures** (male and female, depicting diverse appearances commonly seen in Korea, representing various age groups and styles). They are actively engaged in **specific, clear actions directly related to the ${postingData.position || 'Job Position'}**. Their **expressions are clearly positive, confident, and approachable** (e.g., smiling, focused, energetic), conveying enthusiasm for their work. The interaction between them explicitly shows teamwork and collaboration, creating a strong vertical flow.

The foreground and background environment are rich with **distinct, recognizable elements and tools characteristic of the ${postingData.position || 'Job Position'}**, composed to fill the vertical space effectively. For instance:
* If Frontend Developer, they are actively coding on sleek vertical monitors with vibrant UI/UX elements, or discussing code around a tall, collaborative display.
* If Baker, they are expertly working with dough, decorating pastries with baking tools, or arranging baked goods in a modern, vertically oriented bakery display.
* If Marketing Specialist, they might be brainstorming with tall creative boards, analyzing market trends on vertical screens, or collaborating on a campaign in a dynamic office space.

Around and dynamically integrated with the figures and their work environment, rich and detailed infographic elements burst forth, visually representing three core themes, **seamlessly blended with the context of ${postingData.position || 'Job Position'} and composed for vertical display**:
1.  **Innovation:** Illustrated by creative, dynamic lines, flowing abstract shapes, or bold graphical elements suggesting new ideas, fresh approaches, and forward-thinking solutions **within the specific field of ${postingData.position || 'Job Position'}**, extending vertically.
2.  **Professionalism:** Represented by crisp, well-organized visual structures, upward-trending conceptual graphs (not overly digital), and refined design elements that convey expertise, high standards, and sophisticated execution **relevant to the craft or skill of ${postingData.position || 'Job Position'}**, maintaining vertical balance.
3.  **Teamwork:** Depicted by complex but fluid networks, interwoven abstract forms, and visual metaphors for strong collaboration and shared achievement, all radiating from or connecting the interacting Korean figures and their work, emphasizing a harmonious and productive work environment **relevant to ${postingData.position || 'Job Position'} roles**, with vertical connectivity.

The entire composition is **NOT minimalist**, but rather **rich, layered, and visually energetic**, designed to grab attention within a vertical format. It maintains a ${postingData.styleConcept || 'professional'} aesthetic, interpreted in a more dynamic and engaging way suitable for a modern Korean company. The dominant color palette is based on ${postingData.colorTone || 'blue'}, used vibrantly with complementary accent colors (e.g., bright greens, yellows, purples) to highlight the infographic elements, set against a modern, stimulating background that resonates with contemporary Korean visual trends, all while clearly showcasing the **specific work environment of ${postingData.position || 'Job Position'}** in a compelling vertical layout. The overall mood is aspirational, energetic, and highly professional, optimized for attracting talented individuals to a Korean SME for the ${postingData.position || 'Job Position'} role.

**Critically important: no text, no letters, no typography, text-free, no writing, no numbers, no logos.**`;

/*      // 배너 프롬프트 (가로형)
      const bannerPrompt = `Create a professional recruitment web banner with the following details:
- Company: ${postingData.companyName || 'Company Name'}
- Position: ${postingData.position || 'Job Position'}
- Color tone: ${postingData.colorTone || 'blue'}
- Style: ${postingData.styleConcept || 'professional'}
Design a horizontal landscape banner suitable for a website header.`; */

      // 배너 프롬프트 (가로형)
      const bannerPrompt = `a 16:9 aspect ratio, vibrant and dynamic human infographic banner, specifically designed for a **Korean SME (Small and Medium-sized Enterprise) recruitment advertisement**, targeting 20s-30s Korean professionals.
The scene features **at least two, predominantly Korean professional figures** (male and female, depicting diverse appearances commonly seen in Korea, representing various age groups and styles). They are actively engaged in **specific, clear actions directly related to the ${postingData.position || 'Job Position'}**. Their **expressions are clearly positive, confident, and approachable** (e.g., smiling, focused, energetic), conveying enthusiasm for their work. The interaction between them explicitly shows teamwork and collaboration.
The background and foreground environment are filled with **distinct, recognizable elements and tools characteristic of the ${postingData.position || 'Job Position'}**. For instance:
* If Frontend Developer, they are actively coding on sleek monitors with vibrant UI/UX elements, or discussing code on a whiteboard.
* If Baker, they are expertly kneading dough, decorating pastries with baking tools, or showcasing freshly baked goods in a modern kitchen/bakery.
* If Marketing Specialist, they might be brainstorming with creative boards, analyzing market trends, or collaborating on a campaign launch.

Around and dynamically integrated with the figures and their work environment, rich and detailed infographic elements burst forth, visually representing three core themes, **seamlessly blended with the context of ${postingData.position || 'Job Position'}**:
1.  **Innovation:** Illustrated by creative, dynamic lines, flowing abstract shapes, or bold graphical elements suggesting new ideas, fresh approaches, and forward-thinking solutions **within the specific field of ${postingData.position || 'Job Position'}**.
2.  **Professionalism:** Represented by crisp, well-organized visual structures, upward-trending conceptual graphs (not overly digital), and refined design elements that convey expertise, high standards, and sophisticated execution **relevant to the craft or skill of ${postingData.position || 'Job Position'}**.
3.  **Teamwork:** Depicted by complex but fluid networks, interwoven abstract forms, and visual metaphors for strong collaboration and shared achievement, all radiating from or connecting the interacting Korean figures and their work, emphasizing a harmonious and productive work environment.

The entire composition is **NOT minimalist**, but rather **rich, layered, and visually energetic**, designed to grab attention. It maintains a ${postingData.styleConcept || 'professional'} aesthetic, interpreted in a more dynamic and engaging way suitable for a modern Korean company. The dominant color palette is based on ${postingData.colorTone || 'blue'}, used vibrantly with complementary accent colors (e.g., bright greens, yellows, purples) to highlight the infographic elements, set against a modern, stimulating background that resonates with contemporary Korean visual trends, all while clearly showcasing the **specific work environment of ${postingData.position || 'Job Position'}**. The overall mood is aspirational, energetic, and highly professional, optimized for attracting talented individuals to a Korean SME for the ${postingData.position || 'Job Position'} role.

**Critically important: no text, no letters, no typography, text-free, no writing, no numbers, no logos.**`;

/*      console.log('Posting Data:', postingData);
      console.log('Poster Prompt:', posterPrompt);
      console.log('banner Prompt:', bannerPrompt);*/

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

      // 포스터 이미지 생성 (9:16 aspect ratio for vertical poster)
      const posterResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: posterPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '9:16', // 세로형
        },
      });

      // 배너 이미지 생성 (16:9 aspect ratio for horizontal banner)
      const bannerResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: bannerPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9', // 가로형
        },
      });

      // 포스터 이미지 저장
      if (posterResponse.generatedImages && posterResponse.generatedImages.length > 0) {

          const firstImage = posterResponse.generatedImages?.[0];
          if(!firstImage?.image?.imageBytes || !firstImage?.image?.mimeType || firstImage?.image?.mimeType !== 'image/jpeg'){
              throw new Error('Invalid image data format');
          }

        const posterImageData = firstImage.image.imageBytes;

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
      if (bannerResponse.generatedImages && bannerResponse.generatedImages.length > 0) {

          const firstImage = bannerResponse.generatedImages?.[0];
          if(!firstImage?.image?.imageBytes || !firstImage?.image?.mimeType || firstImage?.image?.mimeType !== 'image/jpeg'){
              throw new Error('Invalid image data format');
          }

        const bannerImageData = firstImage.image.imageBytes;
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
