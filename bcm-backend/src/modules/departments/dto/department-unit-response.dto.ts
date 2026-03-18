import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Unit summary for department units tab
 */
export class DepartmentUnitResponseDto {
  @ApiProperty({ description: 'Unit ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Unit name', example: 'Teen Ministry Unit' })
  name: string;

  @ApiPropertyOptional({ description: 'Unit code', example: 'TMU' })
  code?: string;

  @ApiProperty({
    description: 'Unit status',
    enum: ['active', 'archived'],
    example: 'active',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Unit leader name',
    example: 'Sister Sarah Wilson',
  })
  leader?: string;

  @ApiProperty({ description: 'Member count', example: 45 })
  memberCount: number;

  @ApiPropertyOptional({
    description: 'Leadership alerts for this unit',
    example: 1,
  })
  alerts?: number;
}
