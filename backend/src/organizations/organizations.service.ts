import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { DrizzleService } from '@/drizzle/drizzle.service';
import {
  OrganizationTable,
  OrganizationUserSettingsTable,
} from '@/drizzle/schema';
import { eq, like, and } from 'drizzle-orm';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/organization.dto';
import { S3Service } from '@/s3/s3.service';
import { catchAsync } from '@/utils/catchAsync';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private dbService: DrizzleService,
    private s3Service: S3Service,
  ) {}

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

  private get s3Server() {
    if (!this.s3Service) {
      this.logger.error(`S3 service is down at ${this.getTimestamp()}`);
      throw new InternalServerErrorException({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable. Please try again later.',
      });
    }
    return this.s3Service;
  }

  // Create an organization
  async create(
    dto: CreateOrganizationDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    console.log('gjklsafdkjlfdgjk');
    const { orgName } = dto;

    // Check if organization with same orgName already exists
    const existingOrg = await this.dbServer
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.orgName, orgName))
      .limit(1);

    if (existingOrg.length > 0) {
      this.logger.error(
        `Organization with orgName "${orgName}" already exists`,
      );
      throw new ConflictException({
        code: 'ORGANIZATION_EXISTS',
        message: 'Organization with this orgName already exists',
      });
    }

    let imageUrl: string | undefined;

    // Upload image to S3 if provided
    if (file && file.originalname) {
      const imageKey = `organizations/logos/${Date.now()}-${file.originalname}`;
      await this.s3Server.uploadFile(file, imageKey);
      imageUrl = `${process.env.R2_PUBLIC_DOMAIN}/${imageKey}`;
    }

    // Create organization
    const [organization] = await this.dbServer
      .insert(OrganizationTable)
      .values({
        orgName,
        imageUrl: imageUrl || dto.imageUrl,
      })
      .returning();

    // Assign the creator as a member of the organization
    await this.dbServer.insert(OrganizationUserSettingsTable).values({
      userId,
      organizationId: organization.id,
      newApplicationEmailNotifications: false,
    });

    this.logger.log(
      `Organization created with ID: ${organization.id} and assigned to user: ${userId}`,
    );

    return {
      success: true,
      organization,
    };
  }

  /**
   * Get all organizations with optional filtering
   */
  findAll = catchAsync(async (search?: string, isVerified?: boolean) => {
    if (search && isVerified !== undefined) {
      const organizations = await this.dbServer
        .select()
        .from(OrganizationTable)
        .where(
          and(
            like(OrganizationTable.orgName, `%${search}%`),
            eq(OrganizationTable.isVerified, isVerified),
          ),
        );

      return { success: true, organizations, count: organizations.length };
    } else if (search) {
      const organizations = await this.dbServer
        .select()
        .from(OrganizationTable)
        .where(like(OrganizationTable.orgName, `%${search}%`));

      return { success: true, organizations, count: organizations.length };
    } else if (isVerified !== undefined) {
      const organizations = await this.dbServer
        .select()
        .from(OrganizationTable)
        .where(eq(OrganizationTable.isVerified, isVerified));

      return { success: true, organizations, count: organizations.length };
    } else {
      const organizations = await this.dbServer
        .select()
        .from(OrganizationTable);

      return { success: true, organizations, count: organizations.length };
    }
  }, this.logger);

  /**
   * Get organizations by user ID
   */
  findByUser = catchAsync(
    async (userId: string) => {
      const organizations = await this.dbServer
        .select({
          id: OrganizationTable.id,
          orgName: OrganizationTable.orgName,
          imageUrl: OrganizationTable.imageUrl,
          isVerified: OrganizationTable.isVerified,
          isBanned: OrganizationTable.isBanned,
          createdAt: OrganizationTable.createdAt,
          updatedAt: OrganizationTable.updatedAt,
        })
        .from(OrganizationTable)
        .innerJoin(
          OrganizationUserSettingsTable,
          eq(
            OrganizationTable.id,
            OrganizationUserSettingsTable.organizationId,
          ),
        )
        .where(eq(OrganizationUserSettingsTable.userId, userId));

      return {
        success: true,
        organizations,
        count: organizations.length,
      };
    },
    this.logger,
    'Failed to fetch user organizations',
  );

  /**
   * Get a single organization by ID
   */
  async findOne(id: string) {
    const [organization] = await this.dbServer
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);

    if (!organization) {
      this.logger.error(`Organization with ID ${id} not found`);
      throw new NotFoundException({
        code: 'ORGANIZATION_NOT_FOUND',
        message: 'Organization not found',
      });
    }

    return {
      success: true,
      organization,
    };
  }

  /**
   * Update an organization
   */
  async update(
    id: string,
    dto: UpdateOrganizationDto,
    file?: Express.Multer.File,
  ) {
    // Check if organization exists
    const [existingOrg] = await this.dbServer
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);

    if (!existingOrg) {
      this.logger.error(`Organization with ID ${id} not found`);
      throw new NotFoundException({
        code: 'ORGANIZATION_NOT_FOUND',
        message: 'Organization not found',
      });
    }

    // If orgName is being updated, check for duplicates
    if (dto.orgName && dto.orgName !== existingOrg.orgName) {
      const duplicateOrg = await this.dbServer
        .select()
        .from(OrganizationTable)
        .where(eq(OrganizationTable.orgName, dto.orgName))
        .limit(1);

      if (duplicateOrg.length > 0) {
        throw new ConflictException({
          code: 'ORGANIZATION_EXISTS',
          message: 'Organization with this orgName already exists',
        });
      }
    }

    let imageUrl = dto.imageUrl;

    // Upload new image if provided
    if (file && file.originalname) {
      const imageKey = `organizations/logos/${Date.now()}-${file.originalname}`;
      await this.s3Server.uploadFile(file, imageKey);
      imageUrl = `${process.env.R2_PUBLIC_DOMAIN}/${imageKey}`;
    }

    // Update organization
    const [updatedOrg] = await this.dbServer
      .update(OrganizationTable)
      .set({
        ...dto,
        imageUrl,
      })
      .where(eq(OrganizationTable.id, id))
      .returning();

    this.logger.log(`Organization updated with ID: ${id}`);

    return {
      success: true,
      organization: updatedOrg,
    };
  }

  /**
   * Delete an organization
   */
  async remove(id: string) {
    // Check if organization exists
    const [existingOrg] = await this.dbServer
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);

    if (!existingOrg) {
      this.logger.error(`Organization with ID ${id} not found`);
      throw new NotFoundException({
        code: 'ORGANIZATION_NOT_FOUND',
        message: 'Organization not found',
      });
    }

    // Delete organization
    await this.dbServer
      .delete(OrganizationTable)
      .where(eq(OrganizationTable.id, id));

    this.logger.log(`Organization deleted with ID: ${id}`);

    return {
      success: true,
      message: 'Organization deleted successfully',
    };
  }

  /**
   * Verify an organization
   */
  async verify(id: string) {
    const [organization] = await this.dbServer
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);

    if (!organization) {
      throw new NotFoundException({
        code: 'ORGANIZATION_NOT_FOUND',
        message: 'Organization not found',
      });
    }

    if (organization.isVerified) {
      throw new BadRequestException({
        code: 'ALREADY_VERIFIED',
        message: 'Organization is already verified',
      });
    }

    const [updatedOrg] = await this.dbServer
      .update(OrganizationTable)
      .set({ isVerified: true })
      .where(eq(OrganizationTable.id, id))
      .returning();

    this.logger.log(`Organization verified with ID: ${id}`);

    return {
      success: true,
      organization: updatedOrg,
    };
  }

  /**
   * Ban an organization
   */
  async ban(id: string) {
    const [organization] = await this.dbServer
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);

    if (!organization) {
      throw new NotFoundException({
        code: 'ORGANIZATION_NOT_FOUND',
        message: 'Organization not found',
      });
    }

    if (organization.isBanned) {
      throw new BadRequestException({
        code: 'ALREADY_BANNED',
        message: 'Organization is already banned',
      });
    }

    const [updatedOrg] = await this.dbServer
      .update(OrganizationTable)
      .set({ isBanned: true })
      .where(eq(OrganizationTable.id, id))
      .returning();

    this.logger.log(`Organization banned with ID: ${id}`);

    return {
      success: true,
      organization: updatedOrg,
    };
  }

  /**
   * Unban an organization
   */
  async unban(id: string) {
    const [organization] = await this.dbServer
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);

    if (!organization) {
      throw new NotFoundException({
        code: 'ORGANIZATION_NOT_FOUND',
        message: 'Organization not found',
      });
    }

    if (!organization.isBanned) {
      throw new BadRequestException({
        code: 'NOT_BANNED',
        message: 'Organization is not banned',
      });
    }

    const [updatedOrg] = await this.dbServer
      .update(OrganizationTable)
      .set({ isBanned: false })
      .where(eq(OrganizationTable.id, id))
      .returning();

    this.logger.log(`Organization unbanned with ID: ${id}`);

    return {
      success: true,
      organization: updatedOrg,
    };
  }
}
