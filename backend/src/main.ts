import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('Real Estate API')
    .setDescription('Real Estate Backend API with NestJS, OAuth, and Keycloak')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT-auth'
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('properties', 'Property management endpoints')
    .addTag('master', 'Master data endpoints')
    .addTag('favourites', 'Favourite properties endpoints')
    .addTag('inquiries', 'Inquiry/Ask Guru endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1
    }
  });
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📡 API endpoints available at http://localhost:${port}/api`);
  console.log(
    `📚 Swagger documentation available at http://localhost:${port}/api/docs`
  );
}

bootstrap();
