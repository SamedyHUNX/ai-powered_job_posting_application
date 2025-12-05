import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { UploadController } from './s3/upload.controller';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './logger/winston.config';
import { InngestModule } from './inngest/inngest.module';
import { RedisModule } from './redis/redis.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { JobListingsModule } from './job-listings/job-listings.module';

@Module({
  imports: [
    WinstonModule.forRoot(createWinstonConfig()),
    RedisModule,
    AuthModule,
    OrganizationsModule,
    JobListingsModule,
    S3Module,
    InngestModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
  ],
  controllers: [UploadController],
})
export class AppModule { }
