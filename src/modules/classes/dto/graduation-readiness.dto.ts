import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for graduation readiness information
 */
export class GraduationReadinessDto {
  @ApiProperty({ description: 'Number of members ready' })
  ready: number;

  @ApiProperty({ description: 'Number of members not ready' })
  notReady: number;

  @ApiProperty({ description: 'Completion rate percentage' })
  completionRate: number;

  @ApiProperty({
    description: 'Readiness status',
    enum: ['high', 'medium', 'low'],
    example: 'high',
  })
  readinessStatus: string;
}
