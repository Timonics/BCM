import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * DTO for adding a member to a department (by adding to a unit under the department)
 */
export class AddDepartmentMemberDto {
  @ApiProperty({
    description: 'Member ID to add',
    example: 'uuid',
  })
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description:
      'Unit ID (must belong to this department) to add the member to',
    example: 'uuid',
  })
  @IsUUID()
  unitId: string;
}
