import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for units overview statistics
 * Used in GET /units/overview
 */
export class UnitOverviewStatsDto {
  @ApiProperty({
    description: 'Total number of units',
  })
  totalUnits: number;

  @ApiProperty({
    description: 'Total number of members across all units',
  })
  totalMembers: number;

  @ApiProperty({
    description: 'Number of leadership alerts (expiring or expired roles)',
  })
  leadershipAlerts: number;

  @ApiProperty({
    description: 'Number of active units',
  })
  activeUnits: number;
}
