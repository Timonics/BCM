import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Response } from 'express';
import { CookieService } from './cookie.service';

type ResponseMock = Response & { cookie: jest.Mock };

const createResponseMock = (): ResponseMock =>
  ({
    cookie: jest.fn(),
  } as unknown as ResponseMock);

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let cookieService: jest.Mocked<CookieService>;

  const baseAuthResponse: AuthResponseDto = {
    accessToken: 'mock-jwt-token',
    user: {
      id: 'user-123',
      email: 'admin@bcm.org',
      fullName: 'Admin User',
      roles: ['admin'],
    },
  };

  beforeEach(async () => {
    const mockAuthService: Partial<jest.Mocked<AuthService>> = {
      loginUser: jest.fn(),
      validateUser: jest.fn(),
    };
    const mockCookieService: Partial<jest.Mocked<CookieService>> = {
      getAccessTokenCookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: CookieService,
          useValue: mockCookieService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
    cookieService = module.get(CookieService) as jest.Mocked<CookieService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    const validLoginDto: LoginDto = {
      email: 'admin@bcm.org',
      password: 'password123',
    };
    let response: ResponseMock;

    beforeEach(() => {
      response = createResponseMock();
      cookieService.getAccessTokenCookie.mockReset();
      cookieService.getAccessTokenCookie.mockReturnValue({
        name: 'bcm_access_token',
        value: baseAuthResponse.accessToken,
        options: {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 24 * 60 * 60 * 1000,
        },
      });
    });

    it('should call AuthService.loginUser with DTO and return its result', async () => {
      authService.loginUser.mockResolvedValue(baseAuthResponse);

      const result = await controller.loginUser(validLoginDto, response);

      expect(authService.loginUser).toHaveBeenCalledTimes(1);
      expect(authService.loginUser).toHaveBeenCalledWith(validLoginDto);
      expect(result).toEqual(baseAuthResponse.user);
      expect(cookieService.getAccessTokenCookie).toHaveBeenCalledWith(
        baseAuthResponse.accessToken,
      );
      expect(response.cookie).toHaveBeenCalledTimes(1);
      const [cookieName, cookieValue, cookieOptions] = (
        response.cookie as jest.Mock
      ).mock.calls[0];
      expect(cookieName).toBe('bcm_access_token');
      expect(cookieValue).toBe(baseAuthResponse.accessToken);
      expect(cookieOptions).toMatchObject({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });
    });

    it('should propagate UnauthorizedException from AuthService (invalid credentials)', async () => {
      authService.loginUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(
        controller.loginUser(validLoginDto, response),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.loginUser).toHaveBeenCalledWith(validLoginDto);
      expect(response.cookie).not.toHaveBeenCalled();
      expect(cookieService.getAccessTokenCookie).not.toHaveBeenCalled();
    });

    it('should propagate UnauthorizedException from AuthService (account disabled)', async () => {
      authService.loginUser.mockRejectedValue(
        new UnauthorizedException('Account is disabled'),
      );

      await expect(
        controller.loginUser(validLoginDto, response),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        controller.loginUser(validLoginDto, createResponseMock()),
      ).rejects.toThrow('Account is disabled');
    });

    it('should propagate generic errors from AuthService (e.g. DB error)', async () => {
      authService.loginUser.mockRejectedValue(
        new Error('Unexpected database error'),
      );

      await expect(
        controller.loginUser(validLoginDto, response),
      ).rejects.toThrow('Unexpected database error');
    });

    it('should handle user with multiple roles in response', async () => {
      const multiRoleResponse: AuthResponseDto = {
        accessToken: 'multi-role-token',
        user: {
          id: 'user-456',
          email: 'multi@bcm.org',
          fullName: 'Multi Role User',
          roles: ['superadmin', 'admin', 'coordinator'],
        },
      };

      const multiLoginDto: LoginDto = {
        email: 'multi@bcm.org',
        password: 'strongPassword123',
      };

      authService.loginUser.mockResolvedValue(multiRoleResponse);

      const result = await controller.loginUser(multiLoginDto, response);

      expect(authService.loginUser).toHaveBeenCalledWith(multiLoginDto);
      expect(result.roles).toEqual(['superadmin', 'admin', 'coordinator']);
    });

    it('should handle user with no roles in response (empty roles array)', async () => {
      const noRoleResponse: AuthResponseDto = {
        accessToken: 'no-role-token',
        user: {
          id: 'user-789',
          email: 'norole@bcm.org',
          fullName: 'No Role User',
          roles: [],
        },
      };

      const noRoleDto: LoginDto = {
        email: 'norole@bcm.org',
        password: 'password123',
      };

      authService.loginUser.mockResolvedValue(noRoleResponse);

      const result = await controller.loginUser(noRoleDto, response);

      expect(authService.loginUser).toHaveBeenCalledWith(noRoleDto);
      expect(result.roles).toEqual([]);
    });

    it('should accept different valid login DTOs and pass them through unchanged', async () => {
      const dto1: LoginDto = {
        email: 'first@bcm.org',
        password: 'FirstPass123',
      };
      const dto2: LoginDto = {
        email: 'second@bcm.org',
        password: 'SecondPass456',
      };

      const response1: AuthResponseDto = {
        accessToken: 'token-1',
        user: {
          id: 'u1',
          email: dto1.email,
          fullName: 'First User',
          roles: ['admin'],
        },
      };

      const response2: AuthResponseDto = {
        accessToken: 'token-2',
        user: {
          id: 'u2',
          email: dto2.email,
          fullName: 'Second User',
          roles: ['coordinator'],
        },
      };

      authService.loginUser
        .mockResolvedValueOnce(response1)
        .mockResolvedValueOnce(response2);

      const result1 = await controller.loginUser(dto1, response);
      const result2 = await controller.loginUser(
        dto2,
        createResponseMock(),
      );

      expect(authService.loginUser).toHaveBeenNthCalledWith(1, dto1);
      expect(authService.loginUser).toHaveBeenNthCalledWith(2, dto2);
      expect(result1).toEqual(response1.user);
      expect(result2).toEqual(response2.user);
    });

    it('should work even if email has different casing (controller just forwards DTO)', async () => {
      const upperCaseDto: LoginDto = {
        email: 'ADMIN@BCM.ORG',
        password: 'password123',
      };

      authService.loginUser.mockResolvedValue(baseAuthResponse);

      await controller.loginUser(upperCaseDto, response);

      // Controller does not normalize email; it forwards exactly what it receives
      expect(authService.loginUser).toHaveBeenCalledWith(upperCaseDto);
    });

    it('should handle very long email and password strings in DTO', async () => {
      const longEmail = 'a'.repeat(250) + '@bcm.org';
      const longPassword = 'p'.repeat(1000);

      const longDto: LoginDto = {
        email: longEmail,
        password: longPassword,
      };

      authService.loginUser.mockResolvedValue({
        ...baseAuthResponse,
        user: { ...baseAuthResponse.user, email: longEmail },
      });

      const result = await controller.loginUser(longDto, response);

      expect(authService.loginUser).toHaveBeenCalledWith(longDto);
      expect(result.email).toBe(longEmail);
    });

    it('should handle special characters in password in DTO', async () => {
      const specialPassword = 'p@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?';
      const specialDto: LoginDto = {
        email: 'special@bcm.org',
        password: specialPassword,
      };

      authService.loginUser.mockResolvedValue({
        ...baseAuthResponse,
        user: { ...baseAuthResponse.user, email: specialDto.email },
      });

      const result = await controller.loginUser(specialDto, response);

      expect(authService.loginUser).toHaveBeenCalledWith(specialDto);
      expect(result.email).toBe('special@bcm.org');
    });

    it('should still behave correctly if AuthService returns unexpected roles shape (defensive)', async () => {
      // e.g. roles with null or undefined values
      const weirdResponse: AuthResponseDto = {
        accessToken: 'weird-token',
        user: {
          id: 'user-999',
          email: 'weird@bcm.org',
          fullName: 'Weird User',
          // Deliberately odd data to test runtime behavior
          roles: ['admin', null, undefined] as any,
        },
      };

      authService.loginUser.mockResolvedValue(weirdResponse);

      const result = await controller.loginUser({
        email: 'weird@bcm.org',
        password: 'password123',
      }, response);

      // Controller just forwards whatever AuthService returns
      expect(result).toEqual(weirdResponse.user);
    });

    it('should derive cookie settings from ConfigService when provided', async () => {
      authService.loginUser.mockResolvedValue(baseAuthResponse);
      cookieService.getAccessTokenCookie.mockReturnValue({
        name: 'custom_cookie',
        value: 'custom-token',
        options: {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          domain: 'bcm.org',
          maxAge: 2 * 60 * 60 * 1000,
          path: '/',
        },
      });

      const customResponse = createResponseMock();
      const result = await controller.loginUser(validLoginDto, customResponse);

      expect(result).toEqual(baseAuthResponse.user);
      const [cookieName, cookieValue, cookieOptions] = (
        customResponse.cookie as jest.Mock
      ).mock.calls[0];
      expect(cookieName).toBe('custom_cookie');
      expect(cookieValue).toBe('custom-token');
      expect(cookieOptions).toMatchObject({
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        domain: 'bcm.org',
        maxAge: 2 * 60 * 60 * 1000,
      });
    });
  });
});
