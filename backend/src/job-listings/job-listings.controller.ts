import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { JobListingsService } from './job-listings.service';
import {
    CreateJobListingDto,
    UpdateJobListingDto,
} from './dtos/job-listing.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('job-listings')
export class JobListingsController {
    constructor(private readonly jobListingsService: JobListingsService) { }

    // Create a new job listing: POST /job-listings
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createJobListingDto: CreateJobListingDto,
        @CurrentUser() user: any,
    ) {
        return this.jobListingsService.create(createJobListingDto, user.id);
    }

    // Get all job listings with optional filtering: GET /job-listings?search=...&organizationId=...&status=...
    @Get()
    async findAll(
        @Query('search') search?: string,
        @Query('organizationId') organizationId?: string,
        @Query('status') status?: string,
        @Query('type') type?: string,
        @Query('locationRequirement') locationRequirement?: string,
        @Query('experienceLevel') experienceLevel?: string,
    ) {
        return this.jobListingsService.findAll(
            search,
            organizationId,
            status,
            type,
            locationRequirement,
            experienceLevel,
        );
    }

    // Get a single job listing by ID: GET /job-listings/:id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.jobListingsService.findOne(id);
    }

    // Update a job listing: PATCH /job-listings/:id
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateJobListingDto: UpdateJobListingDto,
    ) {
        return this.jobListingsService.update(id, updateJobListingDto);
    }

    // Delete a job listing: DELETE /job-listings/:id
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return this.jobListingsService.remove(id);
    }

    // Publish a job listing: POST /job-listings/:id/publish
    @Post(':id/publish')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async publish(@Param('id') id: string) {
        return this.jobListingsService.publish(id);
    }

    // Delist a job listing: POST /job-listings/:id/delist
    @Post(':id/delist')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async delist(@Param('id') id: string) {
        return this.jobListingsService.delist(id);
    }
}
