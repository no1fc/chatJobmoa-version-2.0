import { IsEmail, IsString, IsBoolean, IsEnum, MinLength, IsOptional } from 'class-validator';

export enum VerificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export class SendVerificationDto {
  @IsEnum(VerificationType)
  type!: VerificationType;

  @IsString()
  recipient!: string;
}

export class VerifyCodeDto {
  @IsEnum(VerificationType)
  type!: VerificationType;

  @IsString()
  recipient!: string;

  @IsString()
  code!: string;
}

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  emailVerificationToken!: string;

  @IsString()
  phoneVerificationToken!: string;

  @IsBoolean()
  termsAgreement!: boolean;

  @IsOptional()
  @IsBoolean()
  marketingAgreement?: boolean;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
