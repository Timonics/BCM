import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for band overview statistics
 * Used in GET /bands to show summary without full membership details
 */
export class BandOverviewResponseDto {
  @ApiProperty({
    description: 'Band ID',
  })
  id: string;

  @ApiProperty({
    description: 'Band name',
    example: 'Youth Band',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Band code or abbreviation',
    example: 'YTH',
  })
  code?: string;

  @ApiProperty({
    description: 'Band type',
    enum: ['male', 'female', 'mixed'],
    example: 'mixed',
  })
  bandType: string;

  @ApiPropertyOptional({
    description: 'Whether band has age bracket restrictions',
    example: true,
  })
  hasAgeBracket?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum age',
    example: 13,
  })
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Maximum age',
    example: 25,
  })
  maxAge?: number;

  @ApiPropertyOptional({
    description: 'Age bracket display string',
    example: '13-25 years',
  })
  ageBracket?: string;

  @ApiPropertyOptional({
    description: 'Band description',
    example: 'Youth Band serves young adults aged 13-25',
  })
  description?: string;

  @ApiProperty({
    description: 'Band status',
    enum: ['active', 'archived'],
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Total number of members in the band',
    example: 68,
  })
  totalMembers: number;

  @ApiProperty({
    description: 'Number of active members',
    example: 65,
  })
  activeMembers: number;

  @ApiProperty({
    description: 'Number of overgrown members (exceed age bracket)',
    example: 12,
  })
  overgrownMembers: number;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2025-01-07T12:00:00.000Z',
  })
  updatedAt: Date;
}
