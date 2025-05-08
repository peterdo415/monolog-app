// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
// ここを ApiModule ではなく AppModule に変更
import { AppModule } from './app.module';  
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // AppModule を渡すことで ConfigModule も読み込まれる
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('API_PORT', 3001);
  await app.listen(port);
}
bootstrap();
