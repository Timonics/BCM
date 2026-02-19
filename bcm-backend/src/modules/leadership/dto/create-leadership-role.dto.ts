import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

/**
 * DTO for creating a leadership role template
 */
export class CreateLeadershipRoleDto {
  @ApiProperty({
    description:
      'Role name (e.g., Band Leader, Head of Unit, Class Coordinator)',
    example: 'Band Leader',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Role category',
    enum: ['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'],
    example: 'BAND',
  })
  @IsEnum(['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'])
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description:
      'Scope type - global (single holder) or contextual (per band/unit/class)',
    enum: ['global', 'contextual'],
    example: 'contextual',
  })
  @IsEnum(['global', 'contextual'])
  @IsNotEmpty()
  scopeType: string;

  @ApiPropertyOptional({
    description:
      'Whether only one person can hold this role (for global roles)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  singleHolder?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this role requires a tenure duration',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  requiresTenure?: boolean;

  @ApiPropertyOptional({
    description: 'Default tenure duration in months (e.g., 24 for 2 years)',
    example: 24,
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
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allowMultiRolePerMember?: boolean;

  // Note: Description field not in model - would require migration to add
  // @ApiPropertyOptional({
  //   description: 'Role description',
  //   example: 'Leads and coordinates band activities, manages band members',
  //   maxLength: 500,
  // })
  // @IsOptional()
  // @IsString()
  // @MaxLength(500)
  // description?: string;
}
