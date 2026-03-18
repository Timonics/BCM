import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({
    description: 'Unique identifier of the authenticated user',
    example: 'user-123',
  })
  id: string;

  @ApiProperty({
    description: 'Email address',
    example: 'admin@bcm.org',
  })
  email: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Admin User',
  })
  fullName: string;

  @ApiProperty({
    description: 'Assigned role names',
    example: ['admin', 'coordinator'],
    isArray: true,
    type: String,
  })
  roles: string[];
}

/**
 * Internal DTO for authentication service responses
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token (used server-side for cookie issuance)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Authenticated user payload',
    type: AuthUserDto,
  })
  user: AuthUserDto;
}
