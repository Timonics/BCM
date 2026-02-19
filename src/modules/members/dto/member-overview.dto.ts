import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for member overview statistics
 */
export class MemberOverviewDto {
  @ApiProperty({ description: 'Total members' })
  totalMembers: number;

  @ApiProperty({ description: 'Active members' })
  active: number;

  @ApiProperty({ description: 'Overgrown members' })
  overgrown: number;

  @ApiProperty({ description: 'Suspended members' })
  suspended: number;
}
