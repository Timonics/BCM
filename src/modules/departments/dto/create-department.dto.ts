import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * DTO for creating a new department
 */
export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    example: 'Youth Department',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Department category',
    enum: ['Ministry', 'Administrative', 'Support', 'Outreach'],
    example: 'Ministry',
  })
  @IsEnum(['Ministry', 'Administrative', 'Support', 'Outreach'])
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({
    description: 'Head of department (member ID)',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  headOfDepartmentId?: string;

  @ApiProperty({
    description: 'Department description',
    example: 'The Youth Department ministers to teenagers and young adults.',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({
    description: 'Meeting day (e.g., Sunday, Saturday)',
    example: 'Sunday',
  })
  @IsOptional()
  @IsString()
  meetingDay?: string;

  @ApiPropertyOptional({
    description: 'Meeting time (e.g., 3:00 PM)',
    example: '3:00 PM',
  })
  @IsOptional()
  @IsString()
  meetingTime?: string;

  @ApiPropertyOptional({
    description: 'Department status',
    enum: ['active', 'archived'],
    default: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'archived'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Date when the department was founded (YYYY-MM-DD)',
    example: '2005-06-01',
  })
  @IsOptional()
  @IsDateString()
  foundedDate?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of units allowed in this department',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUnits?: number;
}
