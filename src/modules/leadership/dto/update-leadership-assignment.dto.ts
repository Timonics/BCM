import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for updating a leadership assignment
 */
export class UpdateLeadershipAssignmentDto {
  @ApiPropertyOptional({
    description: 'Member ID (to reassign)',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD)',
    example: '2027-01-01',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Leadership status',
    enum: ['active', 'acting', 'ended', 'inactive'],
    example: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'acting', 'ended', 'inactive'])
  leadershipStatus?: string;

  @ApiPropertyOptional({
    description: 'End reason (if status is ended)',
    enum: ['expiry', 'replaced', 'resigned', 'suspended'],
    example: 'expiry',
  })
  @IsOptional()
  @IsEnum(['expiry', 'replaced', 'resigned', 'suspended'])
  endReason?: string;
}
