import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryAttendanceSessionsDto {
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
    description: 'Filter by session type',
    example: 'General Service',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'Filter by session status',
    example: 'open',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
