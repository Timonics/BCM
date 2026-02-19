import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for adding a member to a committee/project (plain membership).
 * Leadership roles (Chair, Secretary, etc.) are assigned separately via the Leadership module.
 */
export class AddCommitteeMemberDto {
  @ApiProperty({
    description: 'Member ID to add to the committee',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD). Defaults to today if not provided.',
    example: '2026-02-10',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
