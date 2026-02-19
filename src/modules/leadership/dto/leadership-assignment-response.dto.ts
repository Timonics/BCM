import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadershipRoleResponseDto } from './leadership-role-response.dto';

/**
 * DTO for leadership assignment response
 */
export class LeadershipAssignmentResponseDto {
  @ApiProperty({ description: 'Assignment ID', example: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Leadership role template',
    type: LeadershipRoleResponseDto,
  })
  role: LeadershipRoleResponseDto;

  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  memberId: string;

  @ApiProperty({ description: 'Member name', example: 'Brother James Parker' })
  memberName: string;

  @ApiPropertyOptional({
    description: 'Member email',
    example: 'james@example.com',
  })
  memberEmail?: string;

  @ApiPropertyOptional({
    description: 'Member phone',
    example: '+1234567890',
  })
  memberPhone?: string;

  @ApiProperty({
    description: 'Scope entity type',
    enum: ['CHURCH', 'BAND', 'UNIT', 'CLASS_BATCH', 'PROJECT'],
    example: 'BAND',
  })
  scopeEntity: string;

  @ApiPropertyOptional({
    description: 'Scope ID (band ID, unit ID, etc.)',
    example: 'uuid',
  })
  scopeId?: string;

  @ApiPropertyOptional({
    description: 'Scope name (band name, unit name, etc.)',
    example: 'Youth Band',
  })
  scopeName?: string;

  @ApiProperty({ description: 'Start date', example: '2025-01-01' })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'End date',
    example: '2027-01-01',
  })
  endDate?: Date;

  @ApiProperty({
    description: 'Leadership status',
    enum: ['active', 'acting', 'ended', 'inactive'],
    example: 'active',
  })
  leadershipStatus: string;

  @ApiPropertyOptional({
    description: 'End reason',
    enum: ['expiry', 'replaced', 'resigned', 'suspended'],
  })
  endReason?: string;

  @ApiProperty({
    description: 'Days until expiry (if endDate is set)',
    example: 15,
  })
  daysUntilExpiry?: number;

  @ApiProperty({
    description: 'Status badge (Active, Due, Expired, Vacant, Inactive)',
    example: 'Active',
  })
  statusBadge: string;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;
}
