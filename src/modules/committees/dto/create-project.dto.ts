import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

const PROJECT_TYPES = [
  'Evangelism',
  'Worship',
  'Education',
  'Infrastructure',
  'Welfare',
  'Youth',
  'Program',
  'Event',
  'Construction',
  'Outreach',
  'General',
] as const;

const STATUSES = ['active', 'planned', 'completed', 'archived'] as const;

/**
 * DTO for creating a committee project
 */
export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Easter Revival Campaign',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Project category/type',
    enum: PROJECT_TYPES,
    example: 'Evangelism',
  })
  @IsEnum(PROJECT_TYPES)
  @IsNotEmpty()
  projectType: string;

  @ApiProperty({
    description: 'Project year',
    example: 2025,
    minimum: 2000,
    maximum: 2100,
  })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'City-wide evangelism campaign',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    description: 'Project start date (YYYY-MM-DD)',
    example: '2025-01-10',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Project end date (YYYY-MM-DD)',
    example: '2025-04-20',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: STATUSES,
    default: 'active',
  })
  @IsOptional()
  @IsEnum(STATUSES)
  status?: string;
}
