import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3055',
    credentials: true,
  });

  await app.listen(3056);
  console.log('Backend server is running on http://localhost:3056');
}

bootstrap();
