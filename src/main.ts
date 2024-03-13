import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Demo Shopping API')
    .setDescription('Shopping CRUD APIs')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addSecurityRequirements('JWT-auth')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-api', app, document);
  await app.listen(3000);
}
bootstrap();
