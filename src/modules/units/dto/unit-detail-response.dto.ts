import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CoordinatorInfoDto {
  @ApiProperty({
    description: 'Coordinator name',
    example: 'Brother Matthew King',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Coordinator email',
    example: 'matthew.king@email.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Coordinator phone',
    example: '+1 (555) 123-4567',
  })
  phone?: string;
}

export class UnitDetailResponseDto {
  @ApiProperty({ description: 'Unit ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Unit name', example: 'Teaching Unit' })
  name: string;

  @ApiPropertyOptional({ description: 'Unit code', example: 'TCH' })
  code?: string;

  @ApiPropertyOptional({
    description: 'Unit description',
    example:
      'Responsible for teaching ministries, Sunday School, and Bible study classes',
  })
  description?: string;

  @ApiProperty({
    description: 'Unit status',
    enum: ['active', 'archived'],
    example: 'active',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Unit coordinator information',
    type: CoordinatorInfoDto,
  })
  coordinator?: CoordinatorInfoDto;

  @ApiPropertyOptional({
    description: 'Date when the unit was founded',
    example: '2008-03-20',
  })
  foundedDate?: Date;

  @ApiPropertyOptional({
    description: 'Meeting schedule day',
    example: 'Wednesdays',
  })
  meetingScheduleDay?: string;

  @ApiPropertyOptional({
    description: 'Meeting schedule time',
    example: '7:00 PM',
  })
  meetingScheduleTime?: string;

  @ApiProperty({
    description: 'Total number of members in the unit',
    example: 28,
  })
  totalMembers: number;

  @ApiProperty({ description: 'Number of active members', example: 26 })
  activeMembers: number;

  @ApiProperty({ description: 'Number of inactive members', example: 2 })
  inactiveMembers: number;

  @ApiProperty({
    description: 'Number of leadership alerts (expiring or expired roles)',
    example: 2,
  })
  leadershipAlerts: number;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2025-01-14T12:00:00.000Z',
  })
  updatedAt: Date;
}
