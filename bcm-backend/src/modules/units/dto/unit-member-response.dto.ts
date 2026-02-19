import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UnitMemberResponseDto {
  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Full name', example: 'Brother Matthew King' })
  name: string;

  @ApiProperty({
    description: 'Gender',
    enum: ['male', 'female'],
    example: 'male',
  })
  gender: string;

  @ApiPropertyOptional({ description: 'Age', example: 42 })
  age?: number;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'matthew.king@email.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1 (555) 123-4567',
  })
  phone?: string;

  @ApiProperty({ description: 'Join date', example: '2020-01-10' })
  joinDate: Date;

  @ApiPropertyOptional({
    description: 'Attendance percentage (null if not tracked)',
    example: 95,
    nullable: true,
  })
  attendance?: number | null;

  @ApiProperty({
    description: 'Member status',
    enum: ['active', 'inactive'],
    example: 'active',
  })
  status: string;
}
