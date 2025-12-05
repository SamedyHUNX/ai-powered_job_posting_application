import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { DrizzleService } from '@/drizzle/drizzle.service';
import { JobListingTable, OrganizationTable } from '@/drizzle/schema';
import { eq, and, like, or } from 'drizzle-orm';
import {
  CreateJobListingDto,
  UpdateJobListingDto,
} from './dtos/job-listing.dto';
import { catchAsync } from '@/utils/catch-async';

@Injectable()
export class JobListingsService {
  private readonly logger = new Logger(JobListingsService.name);

  constructor(private dbService: DrizzleService) {}

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private get dbServer() {
    if (!this.dbService.db) {
      this.logger.error(
        `Database connection not established at ${this.getTimestamp()}`,
      );
      throw new InternalServerErrorException({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable. Please try again later.',
      });
    }
    return this.dbService.db;
  }

  // Create a job listing
  create = catchAsync(
    async (dto: CreateJobListingDto, userId: string) => {
      const { organizationId, ...jobData } = dto;

      // Verify organization exists
      const [organization] = await this.dbServer
        .select()
        .from(OrganizationTable)
        .where(eq(OrganizationTable.id, organizationId))
        .limit(1);

      if (!organization) {
        throw new NotFoundException({
          code: 'ORGANIZATION_NOT_FOUND',
          message: 'Organization not found',
        });
      }

      // Create job listing
      const [jobListing] = await this.dbServer
        .insert(JobListingTable)
        .values({
          ...jobData,
          organizationId,
          status: dto.status || 'draft',
          isFeatured: dto.isFeatured || false,
          postedAt: dto.postedAt ? new Date(dto.postedAt) : null,
        })
        .returning();

      this.logger.log(
        `Job listing created with ID: ${jobListing.id} for organization: ${organizationId}`,
      );

      return {
        success: true,
        message: 'Job listing created successfully',
        jobListing,
      };
    },
    this.logger,
    'Failed to create job listing',
  );

  // Get all job listings with optional filtering
  findAll = catchAsync(
    async (
      search?: string,
      organizationId?: string,
      status?: string,
      type?: string,
      locationRequirement?: string,
      experienceLevel?: string,
    ) => {
      const baseQuery = this.dbServer
        .select({
          id: JobListingTable.id,
          organizationId: JobListingTable.organizationId,
          title: JobListingTable.title,
          description: JobListingTable.description,
          wage: JobListingTable.wage,
          wageInterval: JobListingTable.wageInterval,
          stateAbbreviation: JobListingTable.stateAbbreviation,
          city: JobListingTable.city,
          isFeatured: JobListingTable.isFeatured,
          locationRequirement: JobListingTable.locationRequirement,
          experienceLevel: JobListingTable.experienceLevel,
          status: JobListingTable.status,
          type: JobListingTable.type,
          postedAt: JobListingTable.postedAt,
          createdAt: JobListingTable.createdAt,
          updatedAt: JobListingTable.updatedAt,
          organization: {
            id: OrganizationTable.id,
            orgName: OrganizationTable.orgName,
            imageUrl: OrganizationTable.imageUrl,
            slug: OrganizationTable.slug,
          },
        })
        .from(JobListingTable)
        .leftJoin(
          OrganizationTable,
          eq(JobListingTable.organizationId, OrganizationTable.id),
        );

      const conditions: any[] = [];

      if (search) {
        const searchCondition = or(
          like(JobListingTable.title, `%${search}%`),
          like(JobListingTable.description, `%${search}%`),
        );
        if (searchCondition) conditions.push(searchCondition);
      }
      if (organizationId) {
        conditions.push(eq(JobListingTable.organizationId, organizationId));
      }
      if (status) {
        conditions.push(eq(JobListingTable.status, status as any));
      }
      if (type) {
        conditions.push(eq(JobListingTable.type, type as any));
      }
      if (locationRequirement) {
        conditions.push(
          eq(JobListingTable.locationRequirement, locationRequirement as any),
        );
      }
      if (experienceLevel) {
        conditions.push(
          eq(JobListingTable.experienceLevel, experienceLevel as any),
        );
      }

      const jobListings =
        conditions.length > 0
          ? await baseQuery.where(and(...conditions))
          : await baseQuery;

      return {
        jobListings,
        count: jobListings.length,
      };
    },
    this.logger,
    'Failed to fetch job listings',
  );

  // Get a single job listing by ID
  findOne = catchAsync(
    async (id: string) => {
      const [jobListing] = await this.dbServer
        .select({
          id: JobListingTable.id,
          organizationId: JobListingTable.organizationId,
          title: JobListingTable.title,
          description: JobListingTable.description,
          wage: JobListingTable.wage,
          wageInterval: JobListingTable.wageInterval,
          stateAbbreviation: JobListingTable.stateAbbreviation,
          city: JobListingTable.city,
          isFeatured: JobListingTable.isFeatured,
          locationRequirement: JobListingTable.locationRequirement,
          experienceLevel: JobListingTable.experienceLevel,
          status: JobListingTable.status,
          type: JobListingTable.type,
          postedAt: JobListingTable.postedAt,
          createdAt: JobListingTable.createdAt,
          updatedAt: JobListingTable.updatedAt,
          organization: {
            id: OrganizationTable.id,
            orgName: OrganizationTable.orgName,
            imageUrl: OrganizationTable.imageUrl,
            slug: OrganizationTable.slug,
          },
        })
        .from(JobListingTable)
        .leftJoin(
          OrganizationTable,
          eq(JobListingTable.organizationId, OrganizationTable.id),
        )
        .where(eq(JobListingTable.id, id))
        .limit(1);

      if (!jobListing) {
        throw new NotFoundException({
          code: 'JOB_LISTING_NOT_FOUND',
          message: 'Job listing not found',
        });
      }

      return {
        success: true,
        jobListing,
      };
    },
    this.logger,
    'Failed to find job listing',
  );

  // Update a job listing
  update = catchAsync(
    async (id: string, dto: UpdateJobListingDto) => {
      // Check if job listing exists
      const [existingListing] = await this.dbServer
        .select()
        .from(JobListingTable)
        .where(eq(JobListingTable.id, id))
        .limit(1);

      if (!existingListing) {
        throw new NotFoundException({
          code: 'JOB_LISTING_NOT_FOUND',
          message: 'Job listing not found',
        });
      }

      // Update job listing
      const [updatedListing] = await this.dbServer
        .update(JobListingTable)
        .set({
          ...dto,
          postedAt: dto.postedAt ? new Date(dto.postedAt) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(JobListingTable.id, id))
        .returning();

      this.logger.log(`Job listing updated with ID: ${id}`);

      return {
        success: true,
        jobListing: updatedListing,
      };
    },
    this.logger,
    'Failed to update job listing',
  );

  // Delete a job listing
  remove = catchAsync(
    async (id: string) => {
      // Check if job listing exists
      const [existingListing] = await this.dbServer
        .select()
        .from(JobListingTable)
        .where(eq(JobListingTable.id, id))
        .limit(1);

      if (!existingListing) {
        throw new NotFoundException({
          code: 'JOB_LISTING_NOT_FOUND',
          message: 'Job listing not found',
        });
      }

      // Delete job listing
      await this.dbServer
        .delete(JobListingTable)
        .where(eq(JobListingTable.id, id));

      this.logger.log(`Job listing deleted with ID: ${id}`);

      return {
        success: true,
        message: 'Job listing deleted successfully',
      };
    },
    this.logger,
    'Failed to remove job listing',
  );

  // Publish a job listing
  publish = catchAsync(
    async (id: string) => {
      const [jobListing] = await this.dbServer
        .select()
        .from(JobListingTable)
        .where(eq(JobListingTable.id, id))
        .limit(1);

      if (!jobListing) {
        throw new NotFoundException({
          code: 'JOB_LISTING_NOT_FOUND',
          message: 'Job listing not found',
        });
      }

      if (jobListing.status === 'published') {
        throw new BadRequestException({
          code: 'ALREADY_PUBLISHED',
          message: 'Job listing is already published',
        });
      }

      const [updatedListing] = await this.dbServer
        .update(JobListingTable)
        .set({
          status: 'published',
          postedAt: new Date(),
        })
        .where(eq(JobListingTable.id, id))
        .returning();

      this.logger.log(`Job listing published with ID: ${id}`);

      return {
        success: true,
        jobListing: updatedListing,
      };
    },
    this.logger,
    'Failed to publish job listing',
  );

  // Delist a job listing
  delist = catchAsync(
    async (id: string) => {
      const [jobListing] = await this.dbServer
        .select()
        .from(JobListingTable)
        .where(eq(JobListingTable.id, id))
        .limit(1);

      if (!jobListing) {
        throw new NotFoundException({
          code: 'JOB_LISTING_NOT_FOUND',
          message: 'Job listing not found',
        });
      }

      if (jobListing.status === 'delisted') {
        throw new BadRequestException({
          code: 'ALREADY_DELISTED',
          message: 'Job listing is already delisted',
        });
      }

      const [updatedListing] = await this.dbServer
        .update(JobListingTable)
        .set({ status: 'delisted' })
        .where(eq(JobListingTable.id, id))
        .returning();

      this.logger.log(`Job listing delisted with ID: ${id}`);

      return {
        success: true,
        jobListing: updatedListing,
      };
    },
    this.logger,
    'Failed to delist job listing',
  );
}
