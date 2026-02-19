import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for authentication response
 * Returns JWT token and user information
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 'uuid',
      email: 'admin@bcm.org',
      fullName: 'Admin User',
      roles: ['admin'],
    },
  })
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
  };
}

