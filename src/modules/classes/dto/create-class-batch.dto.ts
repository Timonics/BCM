import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

/**
 * DTO for creating a class batch
 * Supports Pre-Youth (annual), Baptismal and ETS (biannual - January/August)
 */
export class CreateClassBatchDto {
  @ApiPropertyOptional({
    description: 'Class type code (automatically set by endpoint - do not include in request body)',
    enum: ['PREYOUTH', 'BAPTISMAL', 'ETS'],
    example: 'ETS',
  })
  @IsOptional()
  @IsString()
  classTypeCode?: string;

  @ApiProperty({
    description: 'Batch year',
    example: 2025,
  })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiPropertyOptional({
    description: 'Intake period (JAN, AUG, or ANNUAL for Pre-Youth)',
    enum: ['JAN', 'AUG', 'ANNUAL'],
    example: 'JAN',
  })
  @IsOptional()
  @IsEnum(['JAN', 'AUG', 'ANNUAL'])
  intake?: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-01-05',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD)',
    example: '2025-05-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Batch description',
    example: 'Baptismal Class for January 2025 intake',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Maximum capacity',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @ApiPropertyOptional({
    description: 'Whether batch is system-generated',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  systemGenerated?: boolean;
}
