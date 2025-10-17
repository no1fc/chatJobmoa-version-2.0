import {
  Injectable,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { RecommendKeywordsResponseDto } from '../dto/ai.dto';

@Injectable()
export class AiTextService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable not set. Gemini API calls will fail.');
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async recommendKeywords(
    jobType: string,
    position: string,
  ): Promise<RecommendKeywordsResponseDto> {
    try {
      const prompt = `직종 '${jobType}', 직무 '${position}'에 대한 채용 공고 키워드 10개와 우대 자격요건 5개를 JSON 형식으로 추천해줘. 응답은 반드시 다음 형식을 따라야 해:
{
  "keywords": ["키워드1", "키워드2", ...],
  "qualifications": ["자격요건1", "자격요건2", ...]
}

JSON 형식만 반환하고 다른 텍스트는 포함하지 마.`;

      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const response = result.candidates?.[0]?.content?.parts?.[0];
      if (!response || !response.text) {
        throw new Error('No text response from AI');
      }
      const text = response.text;

      // JSON 파싱
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      return {
        keywords: parsedData.keywords || [],
        qualifications: parsedData.qualifications || [],
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('API')) {
          throw new ServiceUnavailableException('AI service unavailable.');
        }
        throw new InternalServerErrorException(
          'Failed to process AI recommendation.',
        );
      }
      throw new InternalServerErrorException(
        'Failed to process AI recommendation.',
      );
    }
  }

  async generateHtml(
    postingData: Record<string, unknown>,
    benefits: Array<Record<string, unknown>>,
  ): Promise<string> {
    try {
      const prompt = `다음 JSON 데이터를 기반으로 **Tailwind CSS 유틸리티 클래스**만을 사용한 **하나의 완성된 반응형 HTML** 코드를 생성해줘.
<head>에 Tailwind CDN 스크립트(https://cdn.tailwindcss.com)를 포함하고, 다음 디자인 규칙을 준수해줘:
- Primary 색상: bg-blue-600, text-blue-600
- Accent 색상: bg-green-500, text-green-500
- 배경색: bg-gray-100
- <style> 태그나 인라인 style= 은 사용하지 마.

JSON 데이터:
${JSON.stringify({ posting: postingData, benefits }, null, 2)}

HTML 코드만 반환하고 다른 텍스트는 포함하지 마.`;

      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const response = result.candidates?.[0]?.content?.parts?.[0];
      if (!response || !response.text) {
        throw new Error('No HTML response from AI');
      }
      const html = response.text;

      // HTML 코드 추출 (```html ... ``` 제거)
      const htmlMatch = html.match(/```html\n([\s\S]*?)\n```/) || html.match(/<html[\s\S]*<\/html>/i);

      if (htmlMatch) {
        return htmlMatch[1] || htmlMatch[0];
      }

      return html;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('API')) {
          throw new ServiceUnavailableException('AI text generation failed.');
        }
      }
      throw new InternalServerErrorException('Failed to generate HTML.');
    }
  }
}
