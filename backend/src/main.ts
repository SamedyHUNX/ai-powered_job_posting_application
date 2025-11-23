import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { createWinstonConfig } from './logger/winston.config';
import { WinstonModule } from 'nest-winston';
import * as dotenv from 'dotenv';
import { ClassSerializerInterceptor } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createWinstonConfig()),
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
