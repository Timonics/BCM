import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';

/**
 * DTO for approving class enrollments
 */
export class ApproveEnrollmentDto {
  @ApiPropertyOptional({
    description:
      'Array of member IDs to approve. If empty, approves all pending',
    type: [String],
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @ApiPropertyOptional({
    description:
      'Array of enrollment IDs to approve (alternative to memberIds)',
    type: [String],
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enrollmentIds?: string[];

  @ApiPropertyOptional({
    description: 'Action type',
    enum: ['approve', 'fail', 'approve_all', 'fail_all'],
    example: 'approve',
  })
  @IsOptional()
  @IsEnum(['approve', 'fail', 'approve_all', 'fail_all'])
  action?: string;
}
