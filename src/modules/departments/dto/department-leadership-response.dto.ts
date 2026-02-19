import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Leadership entry for department leadership tab
 */
export class DepartmentLeadershipResponseDto {
  @ApiProperty({ description: 'Assignment ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Leader full name', example: 'Brother Michael Johnson' })
  name: string;

  @ApiProperty({ description: 'Role name', example: 'Head of Department' })
  role: string;

  @ApiProperty({
    description: 'Status',
    enum: ['active', 'acting', 'inactive'],
    example: 'active',
  })
  status: string;

  @ApiPropertyOptional({ description: 'End date', example: '2025-02-10' })
  endDate?: string;

  @ApiPropertyOptional({ description: 'Days until expiry (if expiring soon)', example: 14 })
  daysUntilExpiry?: number;
}
