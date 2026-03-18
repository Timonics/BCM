import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for querying leadership assignments
 */
export class LeadershipQueryDto {
  @ApiPropertyOptional({
    description: 'Search by role name, member name, or scope name',
    example: 'Band Leader',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: ['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'],
  })
  @IsOptional()
  @IsEnum(['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'])
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by scope entity',
    enum: ['CHURCH', 'BAND', 'UNIT', 'CLASS_BATCH', 'PROJECT', 'DEPARTMENT'],
  })
  @IsOptional()
  @IsEnum(['CHURCH', 'BAND', 'UNIT', 'CLASS_BATCH', 'PROJECT', 'DEPARTMENT'])
  scopeEntity?: string;

  @ApiPropertyOptional({
    description: 'Filter by scope ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  scopeId?: string;

  @ApiPropertyOptional({
    description: 'Filter by leadership status',
    enum: ['active', 'acting', 'ended', 'inactive'],
  })
  @IsOptional()
  @IsEnum(['active', 'acting', 'ended', 'inactive'])
  leadershipStatus?: string;

  @ApiPropertyOptional({
    description:
      'Filter by status badge (Active, Due, Expired, Vacant, Inactive)',
    enum: ['Active', 'Due', 'Expired', 'Vacant', 'Inactive'],
  })
  @IsOptional()
  @IsEnum(['Active', 'Due', 'Expired', 'Vacant', 'Inactive'])
  statusBadge?: string;

  @ApiPropertyOptional({
    description: 'Page number (for pagination)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
