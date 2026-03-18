import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const cookieName =
      configService.get<string>('AUTH_COOKIE_NAME') ||
      configService.get<string>('JWT_COOKIE_NAME') ||
      'bcm_access_token';

    const cookieExtractor = (req: Request): string | null => {
      if (!req || !req.headers) {
        return null;
      }

      const rawCookie = req.headers.cookie;
      if (!rawCookie) {
        return null;
      }

      const cookies = rawCookie.split(';');
      for (const cookie of cookies) {
        const [key, ...rest] = cookie.split('=');
        if (key && key.trim() === cookieName) {
          return rest.join('=').trim() || null;
        }
      }
      return null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  /**
   * Validates the JWT payload and returns user data
   * This method is called after JWT is verified
   * Loads user with roles and permissions for authorization
   */
  async validate(payload: any) {
    const user = await this.usersService.findByIdWithRoles(payload.sub);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }
}
