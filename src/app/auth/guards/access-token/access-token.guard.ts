import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
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

   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the execution context
    const request = context.switchToHttp().getRequest();

    // Allow unauthenticated access to the sign-in endpoint
    if (
      request.path === '/api/v1/auth/refresh-token' ||
      request.path === '/api/v1/auth/sign-in' ||
      request.path === '/api/v1/auth/verify-otp' ||
      request.path === '/api/v1/auth/resend-otp'
    ) {
      return true;
    }
    // Extract the authorization token from the request headers
    const token = this.extractTokenFromCookie(request);

    // If no token is provided, deny access
    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }
    try {
      // Verify and decode the JWT token
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      // Attach the user payload to the request for further processing
      request[REQUEST_USER_KEY] = payload;
    } catch {
      // Handle JWT verification errors (e.g., expired or invalid token)
      throw new UnauthorizedException('Invalid or expired access token');
    }
    // Allow request to proceed
    return true;
  }

  /**
   * Extracts the access token from the Authorization header.
   * @param request The incoming HTTP request.
   * @returns The extracted access token or undefined if not found.
   */

  // private getRequest(context: ExecutionContext): Request {
  //   return context.switchToHttp().getRequest();
  // }
  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies?.accessToken;
    return token;
  }

  // private extractRequestTokenFromHeader(request: Request): string | undefined {
  //   const authorizationHeader = request.headers.authorization;

  //   // Ensure the header exists and follows the "Bearer <token>" format
  //   if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
  //     return undefined;
  //   }

  //   // Extract and return the token part
  //   return authorizationHeader.split(' ')[1];
  // }
}
