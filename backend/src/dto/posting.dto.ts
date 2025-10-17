import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ArrayMaxSize } from 'class-validator';

export enum PostingStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreatePostingDto {
  @IsString()
  @IsNotEmpty()
  title!: string;
}

export class UpdatePostingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PostingStatus)
  status?: PostingStatus;

  // INP-001: 핵심 채용 정보
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  careerLevel?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  salaryRange?: string;

  @IsOptional()
  @IsString()
  workLocation?: string;

  // INP-002: AI 키워드
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  keywords?: string[];

  // INP-003: 기업 정보
  @IsOptional()
  @IsString()
  companyIntro?: string;

  @IsOptional()
  @IsString()
  companyCulture?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsString()
  logoImageUrl?: string;

  // INP-004: 스타일 설정
  @IsOptional()
  @IsString()
  colorTone?: string;

  @IsOptional()
  @IsString()
  styleConcept?: string;

  // INP-005: 선택된 혜택 (JSON 문자열)
  @IsOptional()
  @IsString()
  selectedBenefitsJson?: string;

  // GEN-001/002: 생성된 결과물
  @IsOptional()
  @IsString()
  generatedPosterUrl?: string;

  @IsOptional()
  @IsString()
  generatedBannerUrl?: string;

  @IsOptional()
  @IsString()
  generatedHtml?: string;
}

export class GetPostingsQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
