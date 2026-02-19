import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for GET /departments/overview - page-level statistics
 */
export class DepartmentOverviewStatsDto {
  @ApiProperty({ description: 'Total number of departments' })
  totalDepartments: number;

  @ApiProperty({ description: 'Number of active departments' })
  activeDepartments: number;

  @ApiProperty({
    description: 'Total units across all departments',
  })
  totalUnits: number;

  @ApiProperty({
    description: 'Total members across all departments',
  })
  totalMembers: number;

  @ApiProperty({
    description: 'Number of departments with leadership alerts',
  })
  withAlerts: number;
}
