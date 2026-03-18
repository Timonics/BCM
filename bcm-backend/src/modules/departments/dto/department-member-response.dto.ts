import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Member summary for department members tab
 */
export class DepartmentMemberResponseDto {
  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Full name', example: 'Emily Johnson' })
  name: string;

  @ApiPropertyOptional({ description: 'Gender', example: 'female' })
  gender?: string;

  @ApiPropertyOptional({ description: 'Age', example: 19 })
  age?: number;

  @ApiPropertyOptional({ description: 'Email', example: 'emily@example.com' })
  email?: string;

  @ApiPropertyOptional({ description: 'Phone', example: '+1234567890' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Attendance percentage', example: 92 })
  attendancePercent?: number;

  @ApiProperty({ description: 'Membership status', example: 'Active' })
  status: string;

  @ApiPropertyOptional({
    description: 'Unit name(s) within department',
    example: 'Teen Ministry Unit',
  })
  unitName?: string;
}
