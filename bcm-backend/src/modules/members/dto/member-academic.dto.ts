import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

/**
 * DTO for member academic record
 * Used within CreateMemberDto for Step 3
 */
export class MemberAcademicDto {
  @ApiProperty({
    description: 'Institution name',
    example: 'University of Lagos',
  })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiPropertyOptional({
    description: 'Course or program of study',
    example: 'Computer Science',
  })
  @IsOptional()
  @IsString()
  courseProgram?: string;

  @ApiPropertyOptional({
    description: 'Qualification obtained',
    example: 'B.Sc',
  })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD)',
    example: '2015-09-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD)',
    example: '2019-06-30',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
