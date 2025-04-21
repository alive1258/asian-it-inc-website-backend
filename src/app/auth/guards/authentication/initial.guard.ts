import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import jwtConfig from '../../config/jwt.config';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';

/**
 * InitialAuthenticationGuard
 * --------------------------
 * This guard attempts to authenticate the user if an access token is present.
 * It does not enforce authentication—meaning routes using this guard can be
 * accessed by both authenticated and unauthenticated users.
 *
 * Use cases:
 * - Public pages that adapt content based on whether the user is logged in.
 * - Setting up user context early in the request lifecycle.
 */
@Injectable()
export class InitialAuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    // Inject JWT configuration options
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Main method to determine if a request can proceed.
   * If a valid token is found, the decoded payload is attached to the request.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);

    //  // Attempt to extract JWT token from cookies
    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        // Validate and decode the token using jwtService
        const payload = await this.jwtService.verifyAsync(
          token,
          this.jwtConfiguration,
        );

        // Store decoded user data in request under a custom key
        request[REQUEST_USER_KEY] = payload;
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException('Invalid or expired token.');
      }
    }
    // Whether token is present or not, allow the request to continue
    return true;
  }

  /**
   * Helper method to extract the current HTTP request from the context.
   */
  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  /**
   * Extracts the JWT token from the cookies (if present).
   * Customize this to use headers instead if needed.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.cookies?.accessToken;

    return token;
  }
}
