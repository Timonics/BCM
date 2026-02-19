import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleAssignmentDetailDto } from './role-assignment-detail.dto';

/**
 * DTO for leadership role template response
 */
export class LeadershipRoleResponseDto {
  @ApiProperty({ description: 'Role template ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Role name', example: 'Band Leader' })
  name: string;

  @ApiProperty({
    description: 'Role category',
    enum: ['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE'],
    example: 'BAND',
  })
  category: string;

  @ApiProperty({
    description: 'Scope type',
    enum: ['global', 'contextual'],
    example: 'contextual',
  })
  scopeType: string;

  @ApiProperty({
    description: 'Whether only one person can hold this role',
    example: false,
  })
  singleHolder: boolean;

  @ApiProperty({
    description: 'Whether this role requires tenure',
    example: true,
  })
  requiresTenure: boolean;

  @ApiPropertyOptional({
    description: 'Default tenure duration in months',
    example: 24,
  })
  defaultTenureMonths?: number;

  @ApiProperty({
    description: 'Whether members can hold multiple roles of this type',
    example: true,
  })
  allowMultiRolePerMember: boolean;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Leads and coordinates band activities',
  })
  description?: string;

  @ApiProperty({
    description: 'Role status',
    enum: ['active', 'disabled'],
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Number of active assignments for this role',
    example: 5,
  })
  activeAssignments: number;

  @ApiPropertyOptional({
    description:
      'List of assignments for this role (only included in role details endpoint)',
    type: [RoleAssignmentDetailDto],
  })
  assignments?: RoleAssignmentDetailDto[];

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;
}
