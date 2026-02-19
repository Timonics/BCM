import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../../database/models/user.model';
import { Role } from '../../database/models/role.model';

// Mock bcrypt at module level
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const baseUser: Partial<User> = {
    id: 'user-123',
    email: 'admin@bcm.org',
    passwordHash: '$2b$10$hashedPassword',
    fullName: 'Admin User',
    status: 'active',
  };

  const baseRoles: Role[] = [{ id: 'role-1', name: 'admin' } as Role];

  const userWithRoles: Partial<User> = {
    ...baseUser,
    roles: baseRoles,
  };

  const validLoginDto: LoginDto = {
    email: 'admin@bcm.org',
    password: 'password123',
  };

  beforeEach(async () => {
    const mockUsersService: jest.Mocked<UsersService> = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByIdWithRoles: jest.fn(),
    } as any;

    const mockJwtService: jest.Mocked<JwtService> = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    } as any;

    const mockConfigService: jest.Mocked<ConfigService> = {
      get: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);

    // Default behaviors
    (bcrypt.compare as jest.Mock).mockReset();
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('mock-jwt-token');
    configService.get.mockReturnValue('mock-secret');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should login successfully with valid credentials and map roles correctly', async () => {
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockResolvedValue(userWithRoles as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginUser(validLoginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        validLoginDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        validLoginDto.password,
        baseUser.passwordHash,
      );
      expect(usersService.findByIdWithRoles).toHaveBeenCalledWith(baseUser.id);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: baseUser.id,
        email: baseUser.email,
        roles: ['admin'],
      });

      const expected: AuthResponseDto = {
        accessToken: 'mock-jwt-token',
        user: {
          id: baseUser.id,
          email: baseUser.email,
          fullName: baseUser.fullName,
          roles: ['admin'],
        },
      };
      expect(result).toEqual(expected);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        validLoginDto.email,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(usersService.findByIdWithRoles).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user status is not active', async () => {
      const disabledUser = { ...baseUser, status: 'disabled' };
      usersService.findByEmail.mockResolvedValue(disabledUser as User);

      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        'Account is disabled',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        validLoginDto.email,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(usersService.findByIdWithRoles).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        validLoginDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        validLoginDto.password,
        baseUser.passwordHash,
      );
      expect(usersService.findByIdWithRoles).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle user with no roles and return empty roles array', async () => {
      const userNoRoles: Partial<User> = { ...baseUser, roles: [] as Role[] };
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockResolvedValue(userNoRoles as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginUser(validLoginDto);

      expect(result.user.roles).toEqual([]);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: baseUser.id,
        email: baseUser.email,
        roles: [],
      });
    });

    it('should correctly map multiple role names from user roles', async () => {
      const roles: Role[] = [
        { id: 'role-1', name: 'superadmin' } as Role,
        { id: 'role-2', name: 'admin' } as Role,
        { id: 'role-3', name: 'coordinator' } as Role,
      ];
      const multiRoleUser: Partial<User> = { ...baseUser, roles };
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockResolvedValue(multiRoleUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginUser(validLoginDto);

      expect(result.user.roles).toEqual(['superadmin', 'admin', 'coordinator']);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: baseUser.id,
        email: baseUser.email,
        roles: ['superadmin', 'admin', 'coordinator'],
      });
    });

    it('should throw if roles is undefined (defensive edge case)', async () => {
      // This matches current implementation: it will crash on `userWithRoles.roles.map`
      const brokenUser: Partial<User> = { ...baseUser, roles: undefined };
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockResolvedValue(brokenUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.loginUser(validLoginDto)).rejects.toThrow();
    });

    it('should propagate errors from UsersService.findByEmail', async () => {
      usersService.findByEmail.mockRejectedValue(
        new Error('DB error on findByEmail'),
      );

      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        'DB error on findByEmail',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        validLoginDto.email,
      );
    });

    it('should propagate errors from UsersService.findByIdWithRoles', async () => {
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockRejectedValue(
        new Error('DB error on findByIdWithRoles'),
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        'DB error on findByIdWithRoles',
      );
    });

    it('should propagate errors from bcrypt.compare', async () => {
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      (bcrypt.compare as jest.Mock).mockRejectedValue(
        new Error('bcrypt error'),
      );

      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        'bcrypt error',
      );
    });

    it('should propagate errors from jwtService.sign', async () => {
      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockResolvedValue(userWithRoles as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockImplementation(() => {
        throw new Error('JWT error');
      });

      await expect(service.loginUser(validLoginDto)).rejects.toThrow(
        'JWT error',
      );
    });

    it('should handle different valid login DTOs (case-insensitive email from client side)', async () => {
      const upperEmailDto: LoginDto = {
        email: 'ADMIN@BCM.ORG',
        password: 'password123',
      };

      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockResolvedValue(userWithRoles as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.loginUser(upperEmailDto);

      // Service does not normalize email; it passes whatever is given to findByEmail
      expect(usersService.findByEmail).toHaveBeenCalledWith('ADMIN@BCM.ORG');
    });

    it('should work when ConfigService returns JWT settings', async () => {
      // Not directly used inside AuthService.loginUser, but we ensure config is wired
      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'my-secret';
        if (key === 'JWT_EXPIRES_IN') return '1h';
        return undefined;
      });

      usersService.findByEmail.mockResolvedValue(baseUser as User);
      usersService.findByIdWithRoles.mockResolvedValue(userWithRoles as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('config-jwt-token');

      const result = await service.loginUser(validLoginDto);

      expect(result.accessToken).toBe('config-jwt-token');
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user when user exists', async () => {
      usersService.findById.mockResolvedValue(baseUser as User);

      const result = await service.validateUser(baseUser.id);

      expect(usersService.findById).toHaveBeenCalledWith(baseUser.id);
      expect(result).toEqual(baseUser);
    });

    it('should return null when user does not exist', async () => {
      usersService.findById.mockResolvedValue(null);

      const result = await service.validateUser('non-existent-id');

      expect(usersService.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('should accept any string as userId (including invalid UUIDs)', async () => {
      usersService.findById.mockResolvedValue(null);

      const result = await service.validateUser('not-a-uuid');

      expect(usersService.findById).toHaveBeenCalledWith('not-a-uuid');
      expect(result).toBeNull();
    });

    it('should propagate errors from UsersService.findById', async () => {
      usersService.findById.mockRejectedValue(
        new Error('DB error on findById'),
      );

      await expect(service.validateUser(baseUser.id)).rejects.toThrow(
        'DB error on findById',
      );
    });
  });
});
