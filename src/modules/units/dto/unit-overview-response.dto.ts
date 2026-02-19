import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for unit overview statistics
 * Used in GET /units to show summary without full membership details
 */
export class UnitOverviewResponseDto {
  @ApiProperty({
    description: 'Unit ID',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Unit name',
    example: 'Teaching Unit',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Unit code or abbreviation',
    example: 'TCH',
  })
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

  @ApiProperty({
    description: 'Total number of members in the unit',
    example: 28,
  })
  totalMembers: number;

  @ApiProperty({
    description: 'Number of active members',
    example: 26,
  })
  activeMembers: number;

  @ApiProperty({
    description: 'Number of inactive members',
    example: 2,
  })
  inactiveMembers: number;

  @ApiPropertyOptional({
    description: 'Unit coordinator name',
    example: 'Brother Matthew King',
  })
  coordinator?: string;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2025-01-14T12:00:00.000Z',
  })
  updatedAt: Date;
}
