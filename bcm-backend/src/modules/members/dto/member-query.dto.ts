import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for member query parameters (search and filter)
 */
export class MemberQueryDto {
  @ApiPropertyOptional({
    description: 'Search by name, ID, band, or unit',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by gender',
    enum: ['male', 'female'],
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({
    description: 'Filter by band ID',
  })
  @IsOptional()
  @IsString()
  bandId?: string;

  @ApiPropertyOptional({
    description: 'Filter by unit ID',
  })
  @IsOptional()
  @IsString()
  unitId?: string;

  @ApiPropertyOptional({
    description: 'Filter by class batch ID',
  })
  @IsOptional()
  @IsString()
  classBatchId?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ['active', 'suspended', 'overgrown'],
  })
  @IsOptional()
  @IsEnum(['active', 'suspended', 'overgrown'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

