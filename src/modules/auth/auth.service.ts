import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

/**
 * Authentication Service
 * Handles user authentication, JWT token generation, and password management
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Validates user credentials and returns JWT token
   * @param loginDto - Email and password
   * @returns JWT token and user information
   */
  async loginUser(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is disabled');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Load user roles
    const userWithRoles = await this.usersService.findByIdWithRoles(user.id);

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      roles: userWithRoles.roles.map((role) => role.name),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: userWithRoles.roles.map((role) => role.name),
      },
    };
  }

  /**
   * Validates JWT token payload
   * Used by JWT strategy
   */
  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
