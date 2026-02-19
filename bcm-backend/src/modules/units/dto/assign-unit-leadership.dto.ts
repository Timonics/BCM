import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class AssignUnitLeadershipDto {
  @ApiProperty({
    description: 'Member ID to assign as leader',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    description:
      'Leadership role. Valid values: head_of_unit, assistant_head, secretary',
    enum: ['head_of_unit', 'assistant_head', 'secretary'],
    example: 'head_of_unit',
  })
  @IsEnum(['head_of_unit', 'assistant_head', 'secretary'], {
    message:
      'role must be one of the following values: head_of_unit, assistant_head, secretary',
  })
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD). Defaults to today if not provided',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description:
      'End date (YYYY-MM-DD). Defaults to 2 years from start if not provided',
    example: '2027-01-01',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
