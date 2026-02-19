import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

/**
 * DTO for adding a member to a band
 */
export class AddBandMemberDto {
  @ApiProperty({
    description: 'Member ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;
}

