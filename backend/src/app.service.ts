import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'AI 채용 콘텐츠 제작 플랫폼 API Server';
  }
}
