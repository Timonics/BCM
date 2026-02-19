import { SetMetadata } from '@nestjs/common';

/**
 * Key for permissions metadata
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify required permissions for a route
 * @param permissions - Array of permission codes (e.g., ['members:delete'])
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
