import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateClassBatchDto } from './create-class-batch.dto';
import { IsEnum, IsOptional } from 'class-validator';

/**
 * DTO for updating a class batch
 */
export class UpdateClassBatchDto extends PartialType(CreateClassBatchDto) {
  @ApiPropertyOptional({
    description: 'Batch status',
    enum: ['open', 'closed', 'archived', 'not_started', 'started', 'completed'],
    example: 'open',
  })
  @IsOptional()
  @IsEnum(['open', 'closed', 'archived', 'not_started', 'started', 'completed'])
  status?: string;
}
