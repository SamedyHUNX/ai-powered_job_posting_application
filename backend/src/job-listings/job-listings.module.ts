import { Module } from '@nestjs/common';
import { JobListingsController } from './job-listings.controller';
import { JobListingsService } from './job-listings.service';
import { DrizzleModule } from '@/drizzle/drizzle.module';

@Module({
    imports: [DrizzleModule],
    controllers: [JobListingsController],
    providers: [JobListingsService],
    exports: [JobListingsService],
})
export class JobListingsModule { }
