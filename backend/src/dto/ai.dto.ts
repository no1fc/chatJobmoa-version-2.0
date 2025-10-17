import { IsString, IsNotEmpty } from 'class-validator';

export class RecommendKeywordsDto {
  @IsString()
  @IsNotEmpty()
  jobType!: string;

  @IsString()
  @IsNotEmpty()
  position!: string;
}

export class RecommendKeywordsResponseDto {
  keywords!: string[];
  qualifications!: string[];
}
