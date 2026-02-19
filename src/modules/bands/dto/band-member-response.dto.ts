import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BandMemberResponseDto {
  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Member code', example: 'BCM1001' })
  memberCode: string;

  @ApiProperty({ description: 'Full name', example: 'Sarah Johnson' })
  name: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female'], example: 'female' })
  gender: string;

  @ApiPropertyOptional({ description: 'Age', example: 19 })
  age?: number;

  @ApiProperty({ description: 'Join date', example: '2022-01-10' })
  joinDate: Date;

  @ApiPropertyOptional({ description: 'Attendance percentage (null if not tracked)', example: 95, nullable: true })
  attendance?: number | null;

  @ApiProperty({ description: 'Member status', enum: ['active', 'suspended'], example: 'active' })
  status: string;

  @ApiProperty({ description: 'Is overgrown (exceeds age bracket)', example: false })
  isOvergrown: boolean;
}

