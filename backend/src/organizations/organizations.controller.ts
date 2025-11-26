import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/organization.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  // Create a new organization: POST /organizations
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.organizationsService.create(createOrganizationDto, file, user.id);
  }

  /**
   * Get all organizations with optional filtering
   * GET /organizations?search=name&isVerified=true
   */
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('isVerified') isVerified?: string,
  ) {
    const isVerifiedBool =
      isVerified === 'true' ? true : isVerified === 'false' ? false : undefined;
    return this.organizationsService.findAll(search, isVerifiedBool);
  }

  /**
   * Get organizations by user ID
   * GET /organizations/user/:userId
   */
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.organizationsService.findByUser(userId);
  }

  /**
   * Get a single organization by ID
   * GET /organizations/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  /**
   * Update an organization
   * PATCH /organizations/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto, file);
  }

  /**
   * Delete an organization
   * DELETE /organizations/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  /**
   * Verify an organization
   * POST /organizations/:id/verify
   */
  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verify(@Param('id') id: string) {
    return this.organizationsService.verify(id);
  }

  /**
   * Ban an organization
   * POST /organizations/:id/ban
   */
  @Post(':id/ban')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async ban(@Param('id') id: string) {
    return this.organizationsService.ban(id);
  }

  /**
   * Unban an organization
   * POST /organizations/:id/unban
   */
  @Post(':id/unban')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unban(@Param('id') id: string) {
    return this.organizationsService.unban(id);
  }
}
