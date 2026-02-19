import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for department list item (GET /departments)
 */
export class DepartmentOverviewResponseDto {
  @ApiProperty({ description: 'Department ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Department name', example: 'Youth Department' })
  name: string;

  @ApiProperty({
    description: 'Department category',
    enum: ['Ministry', 'Administrative', 'Support', 'Outreach'],
    example: 'Ministry',
  })
  category: string;

  @ApiPropertyOptional({
    description: 'Department description',
    example: 'Ministry to teenagers and young adults',
  })
  description?: string;

  @ApiProperty({
    description: 'Department status',
    enum: ['active', 'archived'],
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Total members (across all units)',
    example: 234,
  })
  totalMembers: number;

  @ApiProperty({ description: 'Number of units in the department', example: 7 })
  unitsCount: number;

  @ApiPropertyOptional({
    description: 'Head of department name',
    example: 'Brother Michael Johnson',
  })
  headOfDepartment?: string;

  @ApiPropertyOptional({
    description: 'Number of leadership alerts (expiring/expired roles)',
    example: 2,
  })
  leadershipAlerts?: number;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2025-01-27T12:00:00.000Z',
  })
  updatedAt: Date;
}
