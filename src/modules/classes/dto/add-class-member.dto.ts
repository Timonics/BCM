import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

/**
 * DTO for adding a member to a class batch
 */
export class AddClassMemberDto {
  @ApiProperty({
    description: 'Member ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiPropertyOptional({
    description: 'Enrollment source',
    enum: ['import', 'manual', 'auto_migrate'],
    example: 'manual',
  })
  @IsOptional()
  @IsEnum(['import', 'manual', 'auto_migrate'])
  source?: string;
}
