import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for class batch leadership information
 */
export class ClassBatchLeadershipDto {
  @ApiProperty({ description: 'Leadership assignment ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Member name', example: 'Pastor David Mensah' })
  name: string;

  @ApiProperty({ description: 'Role name', example: 'Class Coordinator' })
  role: string;

  @ApiProperty({ description: 'Start date', example: '2025-01-01' })
  startDate: Date;

  @ApiPropertyOptional({ description: 'End date', example: '2025-12-31' })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'david.mensah@bcm.org',
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Phone', example: '+233 24 123 4567' })
  phone?: string;

  @ApiProperty({
    description: 'Status',
    enum: ['active', 'acting', 'ended'],
    example: 'active',
  })
  status: string;
}
