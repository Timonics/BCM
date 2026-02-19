import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for class overview statistics response
 * Used for Pre-Youth, Baptismal, and ETS class overviews
 */
export class ClassOverviewResponseDto {
  @ApiProperty({
    description: 'Number of active batches',
  })
  activeBatches: number;

  @ApiProperty({
    description: 'Total number of members in classes',
  })
  membersInClasses: number;

  @ApiProperty({
    description: 'Number of members ready for graduation',
  })
  readyForGraduation: number;

  @ApiProperty({
    description: 'Number of pending approvals',
  })
  pendingApprovals: number;
}
