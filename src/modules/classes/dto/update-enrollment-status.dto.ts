import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO for updating enrollment status
 * Used for approving/failing enrollments or updating graduation status
 */
export class UpdateEnrollmentStatusDto {
  @ApiPropertyOptional({
    description: 'Enrollment status',
    enum: ['enrolled', 'approved', 'failed', 'rolled_over'],
    example: 'approved',
  })
  @IsOptional()
  @IsEnum(['enrolled', 'approved', 'failed', 'rolled_over'])
  enrollmentStatus?: string;

  @ApiPropertyOptional({
    description: 'Graduation status (for Pre-Youth)',
    enum: ['ready', 'not_ready'],
    example: 'ready',
  })
  @IsOptional()
  @IsEnum(['ready', 'not_ready'])
  graduationStatus?: string;

  @ApiPropertyOptional({
    description: 'Band eligible (for ETS)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  bandEligible?: boolean;

  @ApiPropertyOptional({
    description: 'Sessions attended',
    example: 10,
  })
  @IsOptional()
  sessionsAttended?: number;

  @ApiPropertyOptional({
    description: 'Total sessions',
    example: 12,
  })
  @IsOptional()
  totalSessions?: number;
}
