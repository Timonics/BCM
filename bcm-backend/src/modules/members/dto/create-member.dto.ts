import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberAcademicDto } from './member-academic.dto';

/**
 * DTO for creating a new member
 * Validates all member input fields
 */
export class CreateMemberDto {
  @ApiPropertyOptional({
    description: 'Member code (auto-generated if not provided)',
    example: 'BCM1001',
  })
  @IsOptional()
  @IsString()
  memberCode?: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Middle name',
    example: 'Michael',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: 'Surname',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Gender',
    enum: ['male', 'female'],
    example: 'male',
  })
  @IsEnum(['male', 'female'])
  @IsNotEmpty()
  gender: string;

  @ApiPropertyOptional({
    description: 'Date of birth (YYYY-MM-DD)',
    example: '1990-01-15',
  })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({
    description: 'Marital status',
    example: 'single',
  })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional({
    description: 'State of origin',
    example: 'Lagos',
  })
  @IsOptional()
  @IsString()
  stateOfOrigin?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Nigeria',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Residential state',
    example: 'Lagos',
  })
  @IsOptional()
  @IsString()
  residentialState?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Ikeja',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Local Government Area',
    example: 'Ikeja LGA',
  })
  @IsOptional()
  @IsString()
  lga?: string;

  @ApiPropertyOptional({
    description: 'Occupation',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({
    description: 'Address line',
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
  addressLine?: string;

  @ApiPropertyOptional({
    description: 'Membership path',
    enum: ['transfer', 'birth', 'new_convert', 'marriage'],
    example: 'birth',
  })
  @IsOptional()
  @IsEnum(['transfer', 'birth', 'new_convert', 'marriage'])
  membershipPath?: string;

  // Step 2: Church Information
  @ApiPropertyOptional({
    description: 'Baptism status',
    enum: ['not_baptized', 'baptized', 'pending'],
    example: 'baptized',
  })
  @IsOptional()
  @IsEnum(['not_baptized', 'baptized', 'pending'])
  baptismStatus?: string;

  @ApiPropertyOptional({
    description: 'Band ID to assign member to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  bandId?: string;

  @ApiPropertyOptional({
    description: 'Array of unit IDs to assign member to',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  unitIds?: string[];

  @ApiPropertyOptional({
    description: 'Enroll in Pre Youth class',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  enrollPreYouth?: boolean;

  @ApiPropertyOptional({
    description: 'Enroll in Baptismal class',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  enrollBaptismal?: boolean;

  @ApiPropertyOptional({
    description: 'Enroll in ETS class',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  enrollETS?: boolean;

  @ApiPropertyOptional({
    description:
      'Class batch IDs for enrollments (if specific batches are known)',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  classBatchIds?: string[];

  // Step 3: Academics & Work Information
  @ApiPropertyOptional({
    description: 'Educational background records',
    type: [MemberAcademicDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberAcademicDto)
  academics?: MemberAcademicDto[];

  @ApiPropertyOptional({
    description: 'Place of work',
    example: 'Tech Solutions Ltd',
  })
  @IsOptional()
  @IsString()
  placeOfWork?: string;

  @ApiPropertyOptional({
    description: 'Office address',
    example: '123 Business Street, Lagos',
  })
  @IsOptional()
  @IsString()
  officeAddress?: string;
}
