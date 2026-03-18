import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BandLeadershipResponseDto {
  @ApiProperty({ description: 'Leadership assignment ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Member name', example: 'Brother John Smith' })
  name: string;

  @ApiProperty({ description: 'Role name', example: 'Band Coordinator' })
  role: string;

  @ApiProperty({ description: 'Start date of tenure', example: '2024-01-01' })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'End date of tenure',
    example: '2025-12-31',
  })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Member email',
    example: 'john.smith@church.org',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Member phone',
    example: '+1 234-567-8901',
  })
  phone?: string;

  @ApiProperty({
    description: 'Leadership status',
    enum: ['active', 'acting', 'ended'],
    example: 'active',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Days remaining in tenure (if active and end date set)',
    example: 16,
  })
  daysRemaining?: number;
}
