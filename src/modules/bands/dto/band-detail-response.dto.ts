import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CoordinatorInfoDto {
  @ApiProperty({ description: 'Coordinator name', example: 'Brother John Smith' })
  name: string;

  @ApiPropertyOptional({ description: 'Coordinator email', example: 'john.smith@church.org' })
  email?: string;

  @ApiPropertyOptional({ description: 'Coordinator phone', example: '+1 234-567-8901' })
  phone?: string;
}

export class CaptainInfoDto {
  @ApiProperty({ description: 'Captain name', example: 'Brother Michael Johnson' })
  name: string;

  @ApiPropertyOptional({ description: 'Captain email', example: 'michael.johnson@church.org' })
  email?: string;

  @ApiPropertyOptional({ description: 'Captain phone', example: '+1 234-567-8902' })
  phone?: string;
}

export class BandDetailResponseDto {
  @ApiProperty({ description: 'Band ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Band name', example: 'Youth Band' })
  name: string;

  @ApiPropertyOptional({ description: 'Band code', example: 'YTH' })
  code?: string;

  @ApiProperty({ description: 'Band type', enum: ['male', 'female', 'mixed'], example: 'mixed' })
  bandType: string;

  @ApiPropertyOptional({ description: 'Whether band has age bracket restrictions', example: true })
  hasAgeBracket?: boolean;

  @ApiPropertyOptional({ description: 'Minimum age', example: 13 })
  minAge?: number;

  @ApiPropertyOptional({ description: 'Maximum age', example: 25 })
  maxAge?: number;

  @ApiPropertyOptional({ description: 'Age bracket display string', example: '13-25 years' })
  ageBracket?: string;

  @ApiPropertyOptional({ description: 'Band description', example: 'Youth Band serves young adults aged 13-25' })
  description?: string;

  @ApiProperty({ description: 'Band status', enum: ['active', 'archived'], example: 'active' })
  status: string;

  @ApiPropertyOptional({ description: 'Band coordinator information', type: CoordinatorInfoDto })
  coordinator?: CoordinatorInfoDto;

  @ApiPropertyOptional({ description: 'Band captain information', type: CaptainInfoDto })
  captain?: CaptainInfoDto;

  @ApiPropertyOptional({ description: 'Date when the band was founded', example: '2010-01-15' })
  foundedDate?: Date;

  @ApiPropertyOptional({ description: 'Meeting schedule day', example: 'Sundays' })
  meetingScheduleDay?: string;

  @ApiPropertyOptional({ description: 'Meeting schedule time', example: '9:00 AM' })
  meetingScheduleTime?: string;

  @ApiProperty({ description: 'Total number of active members in the band', example: 68 })
  totalMembers: number;

  @ApiProperty({ description: 'Last updated timestamp', example: '2025-01-07T12:00:00.000Z' })
  updatedAt: Date;
}

