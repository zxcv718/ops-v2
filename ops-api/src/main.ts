import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('OPS API')
    .setDescription('노인 돌봄 AI 서비스 API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '인증/인가')
    .addTag('health', '헬스체크')
    .addTag('guardians', '보호자 관리')
    .addTag('wards', '피보호자 관리')
    .addTag('calls', '통화 관리')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

void bootstrap();
