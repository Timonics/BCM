import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthUserDto } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';
import { CookieService } from './cookie.service';

/**
 * Authentication Controller
 * Handles login and authentication endpoints
 * All endpoints are public (no authentication required)
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * User login endpoint
   * Validates credentials and returns JWT token
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and receive JWT token',
  })
  @ApiOkResponse({
    description: 'Login successful',
    type: AuthUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async loginUser(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserDto> {
    const authResponse = await this.authService.loginUser(loginDto);
    const cookie = this.cookieService.getAccessTokenCookie(
      authResponse.accessToken,
    );
    res.cookie(cookie.name, cookie.value, cookie.options);

    return authResponse.user;
  }
}
