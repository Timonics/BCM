import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

/**
 * DTO for assigning a leadership role to a member
 */
export class AssignLeadershipDto {
  @ApiProperty({
    description: 'Leadership role template ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roleTemplateId: string;

  @ApiProperty({
    description: 'Member ID to assign as leader',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'Scope entity type',
    enum: ['CHURCH', 'BAND', 'UNIT', 'CLASS_BATCH', 'PROJECT', 'DEPARTMENT'],
    example: 'BAND',
  })
  @IsEnum(['CHURCH', 'BAND', 'UNIT', 'CLASS_BATCH', 'PROJECT', 'DEPARTMENT'])
  @IsNotEmpty()
  scopeEntity: string;

  @ApiPropertyOptional({
    description:
      'Scope ID (band ID, unit ID, class batch ID, department ID, etc.). Required for contextual roles, optional for global roles',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  scopeId?: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD). Defaults to today if not provided',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description:
      'End date (YYYY-MM-DD). Defaults based on role template tenure if not provided',
    example: '2027-01-01',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
