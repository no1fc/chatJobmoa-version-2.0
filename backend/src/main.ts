import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정
    // origin: 'http://localhost:3055', localhost 개발 환경에서는 변경해서 사용
    // origin: 'http://58.151.241.130:3055',
  app.enableCors({
    origin: 'http://jobmoachat.kro.kr:3055',
    credentials: true,
  });

  // 정적 파일 서빙 설정
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(3056);
  // console.log('Backend server is running on http://localhost:3056');
  console.log('Backend server is running on http://jobmoachat.kro.kr:3056');
}

bootstrap();
