import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * DTO for assigning a band executive
 * Band executives: Patron, Matron, Captain, Vice-Captain, Secretary
 * Tenure: 2 years minimum
 */
export class AssignBandExecutiveDto {
  @ApiProperty({
    description: 'Member ID to assign as executive',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    description:
      'Executive role. Valid values: patron, matron, captain, vice_captain, secretary',
    enum: ['patron', 'matron', 'captain', 'vice_captain', 'secretary'],
    example: 'captain',
  })
  @IsEnum(['patron', 'matron', 'captain', 'vice_captain', 'secretary'], {
    message:
      'role must be one of the following values: patron, matron, captain, vice_captain, secretary',
  })
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD). Defaults to 2 years from start',
    example: '2027-01-01',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
