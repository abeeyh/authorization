import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CustomHttpExceptionFilter } from './core/errorhandler/errorhandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();
  const config = new DocumentBuilder()
    .setTitle('Auth User Authentication API')
    .setDescription(
      `The Auth User Authentication API provides secure and efficient user authentication and management. 
      It features JWT token handling, password encryption, JWT.IO, 2-factor authentication, and role-based access control. 
      Designed for easy integration with comprehensive audit logs for security compliance.`
    )
    .setVersion('0.0.0')
    .addTag('users')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access-token'
    )
    .build();
  app.useGlobalFilters(new CustomHttpExceptionFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
