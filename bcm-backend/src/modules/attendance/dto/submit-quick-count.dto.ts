import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SubmitQuickCountDto {
  @ApiProperty({
    description: 'Male attendance count',
    example: 180,
  })
  @IsInt()
  @Min(0)
  maleCount: number;

  @ApiProperty({
    description: 'Female attendance count',
    example: 240,
  })
  @IsInt()
  @Min(0)
  femaleCount: number;

  @ApiProperty({
    description: 'Total attendance count',
    example: 420,
  })
  @IsInt()
  @Min(0)
  totalCount: number;
}
