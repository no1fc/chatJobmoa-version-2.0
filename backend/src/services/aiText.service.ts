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
            /*      const prompt = `직종 '${jobType}', 직무 '${position}'에 대한 채용 공고 키워드 10개와 우대 자격요건 5개를 JSON 형식으로 추천해줘. 응답은 반드시 다음 형식을 따라야 해:
            {
              "keywords": ["키워드1", "키워드2", ...],
              "qualifications": ["자격요건1", "자격요건2", ...]
            }

            JSON 형식만 반환하고 다른 텍스트는 포함하지 마.`;*/
            const prompt = `직종 '${jobType}', 직무 '${position}'에 대한 채용 공고 키워드 10개를 JSON 형식으로 추천해줘. 응답은 반드시 다음 형식을 따라야 해:
{
  "keywords": ["키워드1", "키워드2", ...]
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
            // FiXME 이전 prompt 확인 후 수정
            /*      const prompt = `다음 JSON 데이터를 기반으로 **Tailwind CSS 유틸리티 클래스**만을 사용한 **하나의 완성된 반응형 HTML** 코드를 생성해줘.
            <head>에 Tailwind CDN 스크립트(https://cdn.tailwindcss.com)를 포함하고, 다음 디자인 규칙을 준수해줘:
            - Primary 색상: bg-blue-600, text-blue-600
            - Accent 색상: bg-green-500, text-green-500
            - 배경색: bg-gray-100
            - <style> 태그나 인라인 style= 은 사용하지 마.

            JSON 데이터:
            ${JSON.stringify({ posting: postingData, benefits }, null, 2)}

            HTML 코드만 반환하고 다른 텍스트는 포함하지 마.`;*/

            const prompt = `[R] 역할 정의
        당신은 **최신 웹 트렌드에 정통한 UI/UX 디자이너 겸 시니어 프론트엔드 개발자**입니다. 당신의 임무는 제공된 JSON 데이터를 단순한 텍스트 나열이 아닌, **2025년 최신 디자인 트렌드**에 맞춰 시각적으로 재해석하고, **가독성과 시선 집중도**가 매우 높은 채용 공고를 생성하는 것입니다. 결과물은 순수 HTML 코드여야 합니다.
        
        [C] 컨텍스트 및 목적 설정
        제공될 JSON 데이터(채용 공고 정보 및 혜택 포함)를 입력받아, 지정된 Tailwind CSS 스타일 가이드를 따르면서도, **직관적인 UI/UX**와 **현대적인(modern) 디자인**을 적용하여 구직자의 시선을 사로잡는 **완전한 순수 HTML 코드**를 생성해야 합니다. 이 결과물은 추후 PDF/PNG 저장 시에도 모든 정보가 시각적으로 명확하게 보여야 합니다.
        
        [A1] 사고 전략 (CoT 적용)
        작업을 수행하기 전에, \`thought\` 블록을 사용하여 다음 단계를 반드시 거쳐야 합니다.
        1.  **JSON 데이터 구조 분석**: 입력된 JSON 객체(\`posting\` 및 \`benefits\`)의 구조와 모든 키를 파악합니다.
        2.  **핵심 콘텐츠 인지**: \`posting.companyIntro\`, \`posting.companyCulture\`, \`posting.benefits\` 필드에 **'◎', '-', '@' 등 다양한 특수문자**로 구분된 정보가 혼재되어 있음을 인지합니다.
        3.  **콘텐츠 파싱 및 디자인 구상**: \`companyIntro\` 등의 텍스트를 '◎', '-', '@' 등 특수문자를 기준으로 **논리적 섹션(예: 담당업무, 자격요건, 우대사항, 전형절차)으로 분리**합니다.
        4.  **레이아웃 및 트렌디한 스타일링**:
            * 분리된 각 섹션을 단순 목록이 아닌, **카드(Card) UI, 그리드(Grid) 레이아웃** 등을 활용한 **2025년 최신 트렌드에 맞는 디자인**으로 시각화합니다.
            * (예: '자격요건'과 '우대사항'을 \`grid-cols-2\`로 나란히 배치, '혜택' 항목은 태그(chip) 스타일로 표시)
        5.  **핵심 조건 확인**: \`generatedBannerUrl\` 및 \`applyUrl\`의 존재와 유효성을 확인합니다.
        6.  **Tailwind 클래스 적용**: 구상한 레이아웃에 맞춰, [F] 출력 형식의 모든 제약 조건(색상, 파싱 규칙, 링크 스타일)을 만족하는 Tailwind 유틸리티 클래스만을 사용하여 HTML 구조를 작성합니다.
        7.  **최종 코드 생성**: 완성된 단일 순수 HTML 코드를 생성합니다.
        
        [A2] 자가 개선 루프 (Reflexion)
        초안 HTML 코드를 생성한 후, \`thought\` 블록 내에서 다음 항목을 스스로 검토하고 필요시 코드를 수정해야 합니다.
        1.  **디자인 트렌드 반영**: 최종 결과물이 2025년 최신 트렌드(예: 충분한 여백(whitespace), 명확한 시각적 계층 구조, 깔끔한 카드 UI, 모던한 그리드 레이아웃)를 반영했는가? **단순 텍스트 나열에 그치지 않았는가?**
        2.  **콘텐츠 파싱 및 디자인 검증**: \`companyIntro\`와 \`companyCulture\`의 텍스트를 단순히 통째로 붙여넣지는 않았는가? **'◎ 담당업무', '◎ 자격요건' 등이 단순 제목을 넘어, 시각적으로 구분되는 디자인 컴포넌트(예: 배경색이 있는 헤더, 구분선)**로 스타일링되었는가?
        3.  **핵심 조건 충족**: \`generatedBannerUrl\` 및 \`applyUrl\`이 데이터에 있었는데도 HTML에 올바른 형식(이미지, "접수 주소:" 텍스트)으로 누락 없이 반영되었는가?
        4.  **Tailwind 전용**: \`<style>\` 태그나 인라인 \`style="..."\` 속성이 단 하나라도 포함되지는 않았는가? (절대 금지)
        5.  **출력 순수성**: 최종 응답이 **순수한 HTML 텍스트**인가? 마크다운 코드 블록(\`\`\`)이나 설명 텍스트가 포함되지 않았는가?

            [F] 출력 형식 명시
        * **출력물**: 최종 응답은 **오직 순수한 HTML 코드 그 자체**여야 합니다. \` \`\`\`html ... \`\`\` \` 같은 **마크다운 코드 블록으로 절대 감싸지 마세요.**
        * "결과입니다:", "다음은 코드입니다."와 같은 서론이나 코드에 대한 설명, 요약 등 **HTML 코드 외의 어떤 텍스트도 절대 포함해서는 안 됩니다.**
        * **HTML 구조 및 가독성 규칙**:
    * 완전한 \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, \`<body>\` 구조를 갖춰야 합니다.
        * \`<head>\` 태그 내에 \`<script src="https://cdn.tailwindcss.com"></script>\`를 반드시 포함해야 합니다.
        * \`<body>\` 태그에 \`bg-gray-100\` 클래스를 적용하세요.
        * **레이아웃**: \`max-w-4xl mx-auto\` 및 \`bg-white shadow-lg rounded-lg\` 스타일의 '카드' 레이아웃을 사용하세요.
        * **여백**: 카드 내부에 \`p-8\` 및 \`space-y-8\` (또는 \`space-y-10\`)를 적용하여 섹션 간의 **아주 충분한 수직 간격**을 확보하세요.
        * **타이포그래피**:
    * Primary 색상(예: \`posting.title\`): \`text-blue-600\` 및 \`text-3xl font-bold\` 등을 사용하세요.
        * Accent 색상(예: 혜택 태그): \`bg-green-500 text-white\`
        * 본문 텍스트: \`text-gray-800\`, \`leading-relaxed\` (줄 간격)를 적용하여 가독성을 높이세요.
        * **콘텐츠 파싱 및 섹션화 (필수)**:
    * JSON의 \`posting.companyIntro\`, \`posting.companyCulture\`, \`posting.benefits\` 필드의 '◎', '-', '@' 등은 **디자인적으로 구분되는 섹션**으로 재해석해야 합니다.
        * **'◎' 항목 (예: '◎ 담당업무', '◎ 자격요건')**: \`<h2>\` 태그(예: \`text-2xl font-semibold text-gray-900 pb-3 mb-4 border-b-2 border-blue-100\`)를 사용하여 **명확하고 현대적인 섹션 제목**으로 만드세요.
        * **'-' 또는 일반 텍스트 항목**: 단순 \`<li>\` 목록이 아닌, **태그(chip) 스타일**(예: \`bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm\`)이나 \`<ul>\` 목록(예: \`list-disc list-inside\`)을 사용하여 가독성 좋게 디자인하여 시각적 매력도를 높이세요.
        * **레이아웃 활용**: \`grid\`나 \`flex\`를 적극 활용하여 '자격요건'과 '우대사항'을 **나란히 2단으로 배치**하는 등 모던한 레이아웃을 적용하세요.
        * **핵심 조건부 렌더링 (배너)**:
    * \`posting.generatedBannerUrl\`에 유효한 URL이 있다면, **반드시** 해당 URL을 \`src\`로 하는 \`<img>\` 태그를 (예: \`<img src="..." alt="채용 공고 배너" class="w-full h-auto object-cover rounded-t-lg">\`) 카드 상단에 포함해야 합니다.
        * **핵심 조건부 렌더링 (채용 링크)**:
    * \`posting\` 객체 내에 \`applyUrl\` (또는 \`url\` 등)에 유효한 URL이 있다면, **반드시** **"접수 주소: "**라는 접두사 텍스트와 함께 해당 URL을 **순수 텍스트**로 표시해야 합니다. (PDF 출력을 위해 \`<a>\` 태그 금지)
    * **예시**: \`<p class="mt-8 pt-6 border-t border-gray-200 text-gray-800">접수 주소: https://apply.example.com</p>\` (구분선을 넣어 시각적으로 분리)

        [G] 가드레일/윤리적 제약
        * 생성된 HTML에는 어떠한 종류의 악성 스크립트나 트래커도 포함해서는 안 됩니다.
        * 이미지 태그에는 의미 있는 \`alt\` 속성을 추가하여 기본적인 웹 접근성을 준수해야 합니다.
        * 제공된 JSON 데이터 외의 외부 정보나 추측성 콘텐츠를 절대 생성하지 마세요.

            [E] 퓨샷 예시 공간
        (아래는 입력과 출력이 어떻게 보여야 하는지에 대한 형식 예시입니다. 실제 작업 시에는 아래 'JSON 데이터' 섹션의 데이터를 사용하세요.)

    * **예시 입력:**
        \`\`\`json
    {
      "posting": {
        "title": "시니어 개발자 모집",
        "companyIntro": "◎ 담당업무\n - 백엔드 API 개발\n◎ 자격요건\n - 경력 5년 이상",
        "applyUrl": "https://apply.example.com/123"
      },
      "benefits": " - 4대보험, 퇴직금\n - 점심식사 제공"
    }
    \`\`\`
        * **기대 출력 (반드시 이 형식만 반환 - 마크다운 코드 블록 없이 순수 텍스트로):**
        ---

        **[작업 시작]**

        다음 JSON 데이터를 기반으로 위의 모든 규칙을 준수하세요.
        **서론, 결론, 또는 코드에 대한 설명을 절대 포함하지 말고, 오직 완성된 순수 HTML 코드만 반환해야 합니다. (마크다운 \`\`\` 로 감싸지 마세요.)**

**JSON 데이터:**
\`\`\`json
        ${JSON.stringify({ posting: postingData, benefits }, null, 2)}
\`\`\`
`;


            // console.log("prompt: "+prompt);
            /*      prompt 확인용 코드
                  console.log("JSON: "+JSON.stringify({ posting: postingData, benefits }, null, 2));*/

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
