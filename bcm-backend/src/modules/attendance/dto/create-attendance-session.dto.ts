import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * DTO for creating an attendance session
 */
export class CreateAttendanceSessionDto {
  @ApiProperty({
    description: 'Name of the attendance session',
    example: 'Sunday Service - January 5, 2025',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of the attendance session',
    example: 'General Service',
  })
  @IsString()
  @IsNotEmpty()
  sessionType: string;

  @ApiProperty({
    description: 'Date of the attendance session (YYYY-MM-DD)',
    example: '2025-01-05',
  })
  @IsDateString()
  sessionDate: string;

  @ApiProperty({
    description: 'Mode of attendance',
    example: 'Physical',
  })
  @IsString()
  @IsNotEmpty()
  attendanceMode: string;

  @ApiProperty({
    description: 'Method for marking attendance',
    example: 'Manual',
  })
  @IsString()
  @IsNotEmpty()
  markingMode: string;

  @ApiPropertyOptional({
    description:
      'The ID of the band/unit/dept associated with this session (if applicable)',
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  entityId: string;

  @ApiPropertyOptional({
    description: 'Description or notes about the attendance session',
    example: 'First Sunday service of the year',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
