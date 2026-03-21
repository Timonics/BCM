import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MarkAttendanceAttendeeDto {
  @ApiProperty({
    description: 'Member UUID or member code',
    example: 'BCM1001',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    description: 'Attendance status',
    example: 'present',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Check-in timestamp',
    example: '2026-02-01T09:15:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}

export class MarkAttendanceDto {
  @ApiProperty({
    type: [MarkAttendanceAttendeeDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MarkAttendanceAttendeeDto)
  attendees: MarkAttendanceAttendeeDto[];
}
