import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * DTO for adding a member to a unit
 * Note: Members can belong to multiple units simultaneously
 */
export class AddUnitMemberDto {
  @ApiProperty({
    description: 'Member ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD). Defaults to today if not provided',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
