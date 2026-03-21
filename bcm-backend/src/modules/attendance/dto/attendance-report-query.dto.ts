import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class AttendanceReportQueryDto {
  @ApiPropertyOptional({
    description: 'Filter sessions from this date (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter sessions up to this date (YYYY-MM-DD)',
    example: '2026-01-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description:
      'Attendance session type to report on',
    example: 'General Service',
  })
  @IsOptional()
  @IsIn([
    'General Service',
    'Band Meeting',
    'Unit Meeting',
    'Class Session',
    'Committee Meeting',
    'Special Program',
  ])
  groupBy?:
    | 'General Service'
    | 'Band Meeting'
    | 'Unit Meeting'
    | 'Class Session'
    | 'Committee Meeting'
    | 'Special Program';
}
