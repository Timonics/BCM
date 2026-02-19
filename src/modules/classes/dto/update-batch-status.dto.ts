import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

/**
 * DTO for updating batch status
 */
export class UpdateBatchStatusDto {
  @ApiProperty({
    description: 'Batch status',
    enum: ['not_started', 'started', 'completed', 'open', 'closed', 'archived'],
    example: 'started',
  })
  @IsEnum(['not_started', 'started', 'completed', 'open', 'closed', 'archived'])
  @IsNotEmpty()
  status: string;
}
