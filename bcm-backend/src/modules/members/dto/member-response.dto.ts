import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for member response
 * Returns member data with computed age
 */
export class MemberResponseDto {
  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  id: string;

  @ApiPropertyOptional({ description: 'Member code', example: 'BCM1001' })
  memberCode?: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name', example: 'Michael' })
  middleName?: string;

  @ApiProperty({ description: 'Surname', example: 'Doe' })
  surname: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Phone', example: '+1234567890' })
  phone?: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female'] })
  gender: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-15' })
  dob?: Date;

  @ApiPropertyOptional({ description: 'Age (computed)', example: 34 })
  age?: number;

  @ApiPropertyOptional({ description: 'Marital status' })
  maritalStatus?: string;

  @ApiPropertyOptional({ description: 'State of origin' })
  stateOfOrigin?: string;

  @ApiPropertyOptional({ description: 'Country' })
  country?: string;

  @ApiPropertyOptional({ description: 'Residential state' })
  residentialState?: string;

  @ApiPropertyOptional({ description: 'City' })
  city?: string;

  @ApiPropertyOptional({ description: 'LGA' })
  lga?: string;

  @ApiPropertyOptional({ description: 'Occupation' })
  occupation?: string;

  @ApiPropertyOptional({ description: 'Address line' })
  addressLine?: string;

  @ApiPropertyOptional({ description: 'Membership path' })
  membershipPath?: string;

  @ApiProperty({
    description: 'Suspension status',
    enum: ['active', 'suspended'],
  })
  suspensionStatus: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}
