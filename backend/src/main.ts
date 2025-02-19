import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }))

  const frontendOrigin = configService.get<string>('FRONTEND_DOMAIN')

  app.enableCors({
    origin: [frontendOrigin, 'https://poop-party.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
