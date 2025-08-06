import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:8081', 'http://localhost:3001', 'https://betsie-web.vercel.app'];

app.enableCors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

  // app.enableCors({
  // origin: process.env.CORS_ORIGIN || ['http://localhost:8081, http://localhost:3001'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  // ✅ Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Social Auth API')
    .setDescription('API for user management and social login')
    .setVersion('1.0')
    .addBearerAuth() // If you're using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger will be at /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
