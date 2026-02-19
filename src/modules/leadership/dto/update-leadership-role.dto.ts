import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

/**
 * DTO for updating a leadership role template
 */
export class UpdateLeadershipRoleDto {
  @ApiPropertyOptional({
    description: 'Role name',
    example: 'Band Leader',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Role category',
    enum: ['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'],
  })
  @IsOptional()
  @IsEnum(['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'])
  category?: string;

  @ApiPropertyOptional({
    description: 'Scope type',
    enum: ['global', 'contextual'],
  })
  @IsOptional()
  @IsEnum(['global', 'contextual'])
  scopeType?: string;

  @ApiPropertyOptional({
    description: 'Whether only one person can hold this role',
  })
  @IsOptional()
  @IsBoolean()
  singleHolder?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this role requires a tenure duration',
  })
  @IsOptional()
  @IsBoolean()
  requiresTenure?: boolean;

  @ApiPropertyOptional({
    description: 'Default tenure duration in months',
    minimum: 1,
    maximum: 120,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  defaultTenureMonths?: number;

  @ApiPropertyOptional({
    description: 'Whether a member can hold multiple roles of this type',
  })
  @IsOptional()
  @IsBoolean()
  allowMultiRolePerMember?: boolean;

  // Note: Description field not in model - would require migration to add
  // @ApiPropertyOptional({
  //   description: 'Role description',
  //   maxLength: 500,
  // })
  // @IsOptional()
  // @IsString()
  // @MaxLength(500)
  // description?: string;

  @ApiPropertyOptional({
    description: 'Role status',
    enum: ['active', 'disabled'],
  })
  @IsOptional()
  @IsEnum(['active', 'disabled'])
  status?: string;
}
