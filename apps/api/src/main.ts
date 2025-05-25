// apps/api/src/main.ts
import 'tsconfig-paths/register.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';  
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // AppModule を渡すことで ConfigModule も読み込まれる
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('API_PORT', 3001);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(port);
}
bootstrap();
