import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UnitLeadershipResponseDto {
  @ApiProperty({ description: 'Leadership assignment ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Member name', example: 'Brother Matthew King' })
  name: string;

  @ApiProperty({ description: 'Role name', example: 'Head of Unit' })
  role: string;

  @ApiProperty({ description: 'Start date of tenure', example: '2023-01-15' })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'End date of tenure',
    example: '2025-01-14',
  })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Member email',
    example: 'matthew.king@email.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Member phone',
    example: '+1 (555) 123-4567',
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
    example: 15,
  })
  daysRemaining?: number;
}
