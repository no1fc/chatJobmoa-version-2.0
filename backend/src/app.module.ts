import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { PostingModule } from './modules/posting.module';
import { AiModule } from './modules/ai.module';
import { SmeBenefitModule } from './modules/smeBenefit.module';
import { GenerationModule } from './modules/generation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    PostingModule,
    AiModule,
    SmeBenefitModule,
    GenerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
