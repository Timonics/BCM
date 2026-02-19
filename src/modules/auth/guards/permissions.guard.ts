import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Permissions Guard - Checks if user has required permissions
 * Used with @Permissions() decorator for granular access control
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Checks if user has all required permissions
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      return false;
    }

    // Collect all permissions from user's roles
    const userPermissions = new Set<string>();
    user.roles.forEach((role: any) => {
      if (role.permissions) {
        role.permissions.forEach((perm: any) => {
          userPermissions.add(perm.code);
        });
      }
    });

    // Check if user has all required permissions
    return requiredPermissions.every((perm) => userPermissions.has(perm));
  }
}

