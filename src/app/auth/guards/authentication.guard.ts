import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    /**
     * Injects the JwtService to handle JWT-related operations.
     */
    private readonly jwtService: JwtService,

    /**
     * Injects the JWT configuration settings from the config module.
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Determines whether the request can proceed based on authentication.
   * @param context The execution context containing request details.
   * @returns A boolean indicating whether access is granted.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the execution context
    const request = context.switchToHttp().getRequest();

    // Extract the authorization token from the request headers
    const token = this.extractTokenFromCookie(request);

    // If no token is provided, deny access
    if (!token) {
      throw new ForbiddenException('Access token is missing');
    }
    try {
      // Verify and decode the JWT token
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      // Handle JWT verification errors (e.g., expired or invalid token)
      throw new ForbiddenException('Invalid or expired access token');
    }
    // Allow request to proceed
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies?.accessToken;

    return token;
  }
}
