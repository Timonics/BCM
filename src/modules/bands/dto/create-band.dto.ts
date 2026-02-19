import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

/**
 * DTO for creating a new band
 */
export class CreateBandDto {
  @ApiProperty({
    description: 'Band name',
    example: 'Youth Band',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Band code or abbreviation',
    example: 'YTH',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Band type',
    enum: ['male', 'female', 'mixed'],
    example: 'mixed',
  })
  @IsEnum(['male', 'female', 'mixed'])
  @IsNotEmpty()
  bandType: string;

  @ApiPropertyOptional({
    description: 'Whether band has age bracket restrictions',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasAgeBracket?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum age',
    example: 13,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Maximum age',
    example: 25,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  maxAge?: number;

  @ApiPropertyOptional({
    description: 'Band description',
    example: 'Youth Band serves young adults aged 13-25',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date when the band was founded (YYYY-MM-DD)',
    example: '2010-01-15',
  })
  @IsOptional()
  @IsDateString()
  foundedDate?: string;

  @ApiPropertyOptional({
    description: 'Meeting schedule day (e.g., "Sundays", "Mondays", "Every Sunday")',
    example: 'Sundays',
  })
  @IsOptional()
  @IsString()
  meetingScheduleDay?: string;

  @ApiPropertyOptional({
    description: 'Meeting schedule time (e.g., "9:00 AM", "2:00 PM")',
    example: '9:00 AM',
  })
  @IsOptional()
  @IsString()
  meetingScheduleTime?: string;
}

