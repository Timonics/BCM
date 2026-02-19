import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * DTO for assigning class batch leadership
 * Roles: Class Coordinator, Assistant Coordinator, Secretary
 */
export class AssignClassLeadershipDto {
  @ApiProperty({
    description: 'Member ID to assign as leader',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    description: 'Leadership role',
    enum: ['class_coordinator', 'assistant_coordinator', 'secretary'],
    example: 'class_coordinator',
  })
  @IsEnum(['class_coordinator', 'assistant_coordinator', 'secretary'], {
    message:
      'role must be one of: class_coordinator, assistant_coordinator, secretary',
  })
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
