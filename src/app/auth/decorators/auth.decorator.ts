import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';

/**
 * Custom decorator to define the authentication strategy or type
 * required for a specific route or controller.
 *
 * This metadata is later used by guards (like `AuthenticationGuard`)
 * to determine how to handle authentication based on the assigned type(s).
 *
 * @param authTypes - One or more authentication types (from `AuthType` enum).
 * @returns A metadata decorator that sets the auth types under a constant key.
 *
 * Example Usage:
 *   @Auth(AuthType.Bearer)
 *   @Get('profile')
 *   getUserProfile() {}
 */

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
