import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { ActiveUserData } from '../interface/active-user-data.interface';

/**
 * Custom parameter decorator to extract the active (authenticated) user
 * from the request object in a controller method.
 *
 * Usage:
 * - @ActiveUser()           → returns the full user object
 * - @ActiveUser('userId')   → returns a specific field from the user object
 *
 * @param field - Optional key to extract a specific field from the user object.
 * @param ctx - ExecutionContext to access the underlying HTTP request.
 * @returns The full user object or a specific field value.
 */

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    // Get the underlying request from the context
    const request = ctx.switchToHttp().getRequest();

    // Extract the user data set by authentication middleware/guard
    const user: ActiveUserData = request[REQUEST_USER_KEY];

    // Return specific field if provided, otherwise return the full user object
    return field ? user?.[field] : user;
  },
);
