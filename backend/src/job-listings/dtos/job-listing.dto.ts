import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsEnum,
    IsUUID,
    IsDateString,
} from 'class-validator';

export class CreateJobListingDto {
    @IsUUID()
    @IsNotEmpty()
    organizationId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsOptional()
    wage?: number;

    @IsEnum(['hourly', 'yearly'])
    @IsOptional()
    wageInterval?: 'hourly' | 'yearly';

    @IsString()
    @IsOptional()
    stateAbbreviation?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsEnum(['in-office', 'hybrid', 'remote'])
    @IsNotEmpty()
    locationRequirement: 'in-office' | 'hybrid' | 'remote';

    @IsEnum(['junior', 'mid-level', 'senior'])
    @IsNotEmpty()
    experienceLevel: 'junior' | 'mid-level' | 'senior';

    @IsEnum(['draft', 'published', 'delisted'])
    @IsOptional()
    status?: 'draft' | 'published' | 'delisted';

    @IsEnum(['internship', 'part-time', 'full-time'])
    @IsNotEmpty()
    type: 'internship' | 'part-time' | 'full-time';

    @IsDateString()
    @IsOptional()
    postedAt?: string;
}

export class UpdateJobListingDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    wage?: number;

    @IsEnum(['hourly', 'yearly'])
    @IsOptional()
    wageInterval?: 'hourly' | 'yearly';

    @IsString()
    @IsOptional()
    stateAbbreviation?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsEnum(['in-office', 'hybrid', 'remote'])
    @IsOptional()
    locationRequirement?: 'in-office' | 'hybrid' | 'remote';

    @IsEnum(['junior', 'mid-level', 'senior'])
    @IsOptional()
    experienceLevel?: 'junior' | 'mid-level' | 'senior';

    @IsEnum(['draft', 'published', 'delisted'])
    @IsOptional()
    status?: 'draft' | 'published' | 'delisted';

    @IsEnum(['internship', 'part-time', 'full-time'])
    @IsOptional()
    type?: 'internship' | 'part-time' | 'full-time';

    @IsDateString()
    @IsOptional()
    postedAt?: string;
}
