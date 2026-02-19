import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for class batch member information
 */
export class ClassBatchMemberDto {
  @ApiProperty({ description: 'Enrollment ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  memberId: string;

  @ApiProperty({ description: 'Member name', example: 'Kwame Asante' })
  name: string;

  @ApiProperty({
    description: 'Gender',
    enum: ['male', 'female'],
    example: 'male',
  })
  gender: string;

  @ApiPropertyOptional({ description: 'Age', example: 13 })
  age?: number;

  @ApiProperty({ description: 'Enrollment date', example: '2025-01-05' })
  enrolledAt: Date;

  @ApiPropertyOptional({
    description: 'Enrollment source',
    example: 'Pre-Youth',
  })
  enrollmentSource?: string;

  @ApiProperty({
    description: 'Attendance (sessions attended / total)',
    example: '11/12',
  })
  attendance: string;

  @ApiProperty({ description: 'Attendance percentage', example: 92 })
  attendancePercentage: number;

  @ApiProperty({
    description: 'Enrollment status',
    enum: ['enrolled', 'approved', 'failed', 'rolled_over'],
    example: 'enrolled',
  })
  enrollmentStatus: string;

  @ApiPropertyOptional({
    description: 'Graduation status',
    enum: ['ready', 'not_ready'],
    example: 'ready',
  })
  graduationStatus?: string;

  @ApiPropertyOptional({
    description: 'Attempt number (for retakes)',
    example: 1,
  })
  attemptNo?: number;

  @ApiPropertyOptional({
    description: 'Band eligible (for ETS)',
    example: true,
  })
  bandEligible?: boolean;
}
