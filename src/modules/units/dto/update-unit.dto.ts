import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

/**
 * DTO for updating a unit
 */
export class UpdateUnitDto {
  @ApiPropertyOptional({
    description: 'Unit name',
    example: 'Teaching Unit',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Unit code or abbreviation',
    example: 'TCH',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Unit description',
    example: 'Responsible for teaching ministries, Sunday School, and Bible study classes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Date when the unit was founded (YYYY-MM-DD)',
    example: '2008-03-20',
  })
  @IsOptional()
  @IsDateString()
  foundedDate?: string;

  @ApiPropertyOptional({
    description: 'Meeting schedule day (e.g., "Wednesdays", "Every Wednesday")',
    example: 'Wednesdays',
  })
  @IsOptional()
  @IsString()
  meetingScheduleDay?: string;

  @ApiPropertyOptional({
    description: 'Meeting schedule time (e.g., "7:00 PM", "2:00 PM")',
    example: '7:00 PM',
  })
  @IsOptional()
  @IsString()
  meetingScheduleTime?: string;

  @ApiPropertyOptional({
    description: 'Unit status',
    enum: ['active', 'archived'],
  })
  @IsOptional()
  @IsEnum(['active', 'archived'])
  status?: string;
}
