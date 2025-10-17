import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { UploadController } from './s3/upload.controller';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './logger/winston.config';

@Module({
  imports: [
    WinstonModule.forRoot(createWinstonConfig()),
    AuthModule,
    S3Module,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
  ],
  controllers: [UploadController],
})
export class AppModule {}
