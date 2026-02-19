import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for leadership overview statistics
 */
export class LeadershipOverviewResponseDto {
  @ApiProperty({
    description: 'Total number of active leaders',
  })
  totalActiveLeaders: number;

  @ApiProperty({
    description: 'Number of roles expiring within 90 days',
  })
  rolesExpiringSoon: number;

  @ApiProperty({
    description: 'Number of vacant positions',
  })
  vacantPositions: number;

  @ApiProperty({
    description: 'Number of expired positions',
  })
  expiredPositions: number;
}
