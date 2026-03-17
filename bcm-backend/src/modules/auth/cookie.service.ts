import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

interface AccessTokenCookie {
  name: string;
  value: string;
  options: CookieOptions;
}

interface ClearCookie {
  name: string;
  options: CookieOptions;
}

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Builds the cookie payload used when issuing an access token.
   */
  getAccessTokenCookie(token: string): AccessTokenCookie {
    const { name, options } = this.getBaseCookieConfig();
    return {
      name,
      value: token,
      options,
    };
  }

  /**
   * Returns cookie metadata that removes the existing access token.
   */
  getClearAccessTokenCookie(): ClearCookie {
    const { name, options } = this.getBaseCookieConfig();
    return {
      name,
      options: {
        ...options,
        maxAge: 0,
        expires: new Date(0),
      },
    };
  }

  private getBaseCookieConfig(): { name: string; options: CookieOptions } {
    const defaultName = 'bcm_access_token';
    const name =
      this.configService.get<string>('AUTH_COOKIE_NAME') ||
      this.configService.get<string>('JWT_COOKIE_NAME') ||
      defaultName;

    const nodeEnv = (this.configService.get<string>('NODE_ENV') || '').toLowerCase();
    const envSecure = this.configService.get<string>('AUTH_COOKIE_SECURE');
    let secure =
      envSecure !== undefined ? envSecure === 'true' : nodeEnv === 'production';

    const sameSiteConfig =
      (this.configService.get<string>('AUTH_COOKIE_SAME_SITE') ||
        this.configService.get<string>('JWT_COOKIE_SAME_SITE'))?.toLowerCase() ||
      undefined;

    let sameSite: CookieOptions['sameSite'] = 'lax';
    if (sameSiteConfig === 'none' || sameSiteConfig === 'lax' || sameSiteConfig === 'strict') {
      sameSite = sameSiteConfig;
    } else if (secure) {
      sameSite = 'none';
    }

    if (sameSite === 'none' && !secure) {
      secure = true;
    }

    const domain =
      this.configService.get<string>('AUTH_COOKIE_DOMAIN') ||
      this.configService.get<string>('JWT_COOKIE_DOMAIN');

    const options: CookieOptions = {
      httpOnly: true,
      secure,
      sameSite,
      domain: domain || undefined,
      maxAge: this.resolveCookieMaxAge(),
      path: '/',
    };

    return { name, options };
  }

  private resolveCookieMaxAge(): number {
    const rawValue =
      this.configService.get<string>('AUTH_COOKIE_MAX_AGE') ||
      this.configService.get<string>('JWT_COOKIE_MAX_AGE') ||
      this.configService.get<string>('JWT_EXPIRES_IN');

    if (!rawValue) {
      return 24 * 60 * 60 * 1000;
    }

    const parsed = this.parseDuration(rawValue);
    return parsed > 0 ? parsed : 24 * 60 * 60 * 1000;
  }

  private parseDuration(value: string): number {
    const trimmed = value.trim().toLowerCase();
    const durationMatch = trimmed.match(/^(\d+)(ms|s|m|h|d)?$/);

    if (!durationMatch) {
      const numeric = Number(trimmed);
      return Number.isNaN(numeric) ? 0 : numeric * 1000;
    }

    const amount = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2] || 'ms';

    switch (unit) {
      case 'ms':
        return amount;
      case 's':
        return amount * 1000;
      case 'm':
        return amount * 60 * 1000;
      case 'h':
        return amount * 60 * 60 * 1000;
      case 'd':
        return amount * 24 * 60 * 60 * 1000;
      default:
        return amount;
    }
  }
}
