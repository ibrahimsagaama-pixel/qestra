import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Ignore les champs non déclarés dans les DTOs
      forbidNonWhitelisted: false,
      transform: true,       // Transforme automatiquement les types
    }),
  );

  // CORS — autorise le frontend web et mobile
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:19006', '*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Préfixe global de l'API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Qestra API lancée sur http://localhost:${port}/api`);
}

bootstrap();
