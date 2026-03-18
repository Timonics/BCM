import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Head of department info for detail response
 */
export class HeadOfDepartmentInfoDto {
  @ApiProperty({ description: 'Head name', example: 'Brother Michael Johnson' })
  name: string;

  @ApiPropertyOptional({ description: 'Email' })
  email?: string;

  @ApiPropertyOptional({ description: 'Phone' })
  phone?: string;
}

/**
 * DTO for GET /departments/:id - full department detail (overview tab data)
 */
export class DepartmentDetailResponseDto {
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

  @ApiPropertyOptional({ description: 'Department description' })
  description?: string;

  @ApiProperty({
    description: 'Department status',
    enum: ['active', 'archived'],
    example: 'active',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Head of department',
    type: HeadOfDepartmentInfoDto,
  })
  headOfDepartment?: HeadOfDepartmentInfoDto;

  @ApiPropertyOptional({ description: 'Meeting day', example: 'Saturdays' })
  meetingDay?: string;

  @ApiPropertyOptional({ description: 'Meeting time', example: '3:00 PM' })
  meetingTime?: string;

  @ApiPropertyOptional({ description: 'Founded date', example: '2005-06-01' })
  foundedDate?: Date;

  @ApiPropertyOptional({ description: 'Maximum units allowed', example: 10 })
  maxUnits?: number;

  @ApiProperty({ description: 'Total members across units', example: 234 })
  totalMembers: number;

  @ApiProperty({ description: 'Active members count', example: 218 })
  activeMembers: number;

  @ApiProperty({ description: 'Number of units', example: 7 })
  unitsCount: number;

  @ApiProperty({ description: 'Active leaders count', example: 3 })
  leadershipCount: number;

  @ApiProperty({ description: 'Leadership alerts count', example: 0 })
  leadershipAlerts: number;

  @ApiProperty({
    description: 'Last updated',
    example: '2025-01-27T12:00:00.000Z',
  })
  updatedAt: Date;
}
