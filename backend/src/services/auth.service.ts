import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import {
  SendVerificationDto,
  VerifyCodeDto,
  SignUpDto,
  LoginDto,
  VerificationType,
} from '@/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 인증번호 생성 (6자리 난수)
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 인증번호 발송
  async sendVerification(dto: SendVerificationDto): Promise<{ message: string }> {
    const { type, recipient } = dto;

    // 기본 형식 검증
    if (type === VerificationType.EMAIL) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipient)) {
        throw new BadRequestException('Invalid recipient format.');
      }
    } else if (type === VerificationType.SMS) {
      const phoneRegex = /^01[0-9]{8,9}$/;
      if (!phoneRegex.test(recipient)) {
        throw new BadRequestException('Invalid recipient format.');
      }
    }

    // 인증번호 생성
    const code = this.generateVerificationCode();

    // 만료 시간 설정 (3분)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 3);

    // 기존 인증번호 삭제
    await this.prisma.verification.deleteMany({
      where: {
        recipient,
        type,
      },
    });

    // 새 인증번호 저장
    await this.prisma.verification.create({
      data: {
        type,
        recipient,
        code,
        expiresAt,
      },
    });

    // 실제 발송 로직 (이메일/SMS)
    if (type === VerificationType.EMAIL) {
      await this.sendEmail(recipient, code);
    } else {
      await this.sendSMS(recipient, code);
    }

    return { message: 'Verification code sent successfully.' };
  }

  // 이메일 발송 (Nodemailer 사용 - 실제 구현 필요)
  private async sendEmail(email: string, code: string): Promise<void> {
    // TODO: Nodemailer 구현
    console.log(`Email sent to ${email} with code: ${code}`);
  }

  // SMS 발송 (SMS 서비스 사용 - 실제 구현 필요)
  private async sendSMS(phoneNumber: string, code: string): Promise<void> {
    // TODO: SMS 서비스 연동 (Twilio, NHN Cloud 등)
    console.log(`SMS sent to ${phoneNumber} with code: ${code}`);
  }

  // 인증번호 확인
  async verifyCode(dto: VerifyCodeDto): Promise<{ message: string; verificationToken: string }> {
    const { type, recipient, code } = dto;

    const verification = await this.prisma.verification.findFirst({
      where: {
        type,
        recipient,
        code,
      },
    });

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification code.');
    }

    // 만료 시간 확인
    if (new Date() > verification.expiresAt) {
      await this.prisma.verification.delete({
        where: { id: verification.id },
      });
      throw new BadRequestException('Invalid or expired verification code.');
    }

    // 인증번호 삭제 (재사용 방지)
    await this.prisma.verification.delete({
      where: { id: verification.id },
    });

    // 임시 인증 토큰 생성
    const verificationToken = this.jwtService.sign(
      { recipient, type },
      { expiresIn: '10m' },
    );

    return {
      message: 'Verification successful.',
      verificationToken,
    };
  }

  // 회원가입
  async signUp(dto: SignUpDto): Promise<{ message: string; accessToken: string }> {
    const {
      email,
      password,
      phoneNumber,
      emailVerificationToken,
      phoneVerificationToken,
      termsAgreement,
      marketingAgreement,
    } = dto;

    // 필수 동의 확인
    if (!termsAgreement) {
      throw new BadRequestException('Agreement to the terms and privacy policy is required.');
    }

    // 인증 토큰 검증
    try {
      const emailPayload = this.jwtService.verify(emailVerificationToken);
      const phonePayload = this.jwtService.verify(phoneVerificationToken);

      if (
        emailPayload.recipient !== email ||
        emailPayload.type !== VerificationType.EMAIL ||
        phonePayload.recipient !== phoneNumber ||
        phonePayload.type !== VerificationType.SMS
      ) {
        throw new UnauthorizedException('Valid verification token is required.');
      }
    } catch (error) {
      throw new UnauthorizedException('Valid verification token is required.');
    }

    // 중복 확인
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone number already exists.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phoneNumber,
        emailVerified: true,
        phoneVerified: true,
        termsAgreedAt: new Date(),
        marketingAgreement: marketingAgreement || false,
      },
    });

    // 액세스 토큰 생성
    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    return {
      message: 'User successfully created.',
      accessToken,
    };
  }

  // 로그인
  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;

    // 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // 액세스 토큰 생성
    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    return { accessToken };
  }
}
