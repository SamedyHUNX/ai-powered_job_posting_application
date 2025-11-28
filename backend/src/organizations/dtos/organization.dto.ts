import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  orgName: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  orgName?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isBanned?: boolean;
}
