import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';

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
 * Query DTO for filtering committees/projects
 */
export class ProjectQueryDto {
  @ApiPropertyOptional({
    description: 'Search by project name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by year',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({
    description: 'Filter by project type',
    enum: [...PROJECT_TYPES],
  })
  @IsOptional()
  @IsEnum(PROJECT_TYPES)
  projectType?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: [...STATUSES],
  })
  @IsOptional()
  @IsEnum(STATUSES)
  status?: string;

  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
