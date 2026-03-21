import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class GenerateReportDto {
  @ApiProperty({ description: 'Category of the report', example: 'Membership' })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Specific type of report',
    example: 'Member Directory',
  })
  @IsString()
  type: string;

  @ApiPropertyOptional({
    description: 'Date range constraint',
    example: 'Month',
  })
  @IsOptional()
  @IsString()
  dateRange?: string;

  @ApiProperty({
    description: 'Export format',
    enum: ['PDF', 'Excel', 'CSV'],
    example: 'PDF',
  })
  @IsEnum(['PDF', 'Excel', 'CSV'])
  exportFormat: string;

  @ApiPropertyOptional({
    description: 'Additional filter options',
    example: { status: 'Active' },
  })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}
