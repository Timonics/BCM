import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for marking members as ready for graduation
 * Used for Baptismal and Pre-Youth classes
 */
export class MarkReadyDto {
  @ApiPropertyOptional({
    description:
      'Array of member IDs to mark as ready. If empty, marks all eligible members',
    type: [String],
    example: ['c1fa5d28-4099-490f-bb0a-5cca84d9aef4'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true, message: 'Each memberId must be a valid UUID' })
  memberIds?: string[];

  @ApiPropertyOptional({
    description:
      'Array of enrollment IDs to mark as ready (alternative to memberIds)',
    type: [String],
    example: ['f4bf2272-246a-4a61-bd52-f36124a999cc'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true, message: 'Each enrollmentId must be a valid UUID' })
  enrollmentIds?: string[];
}
