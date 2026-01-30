import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Security: Helmet (HTTP headers)
  app.use(helmet());

  // Security: CORS
  const configService = app.get(ConfigService);
  const allowedOrigins = configService
    .get<string>('CORS_ORIGINS', 'http://localhost:3001')
    .split(',');

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Validation: XSS prevention via whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

void bootstrap();
