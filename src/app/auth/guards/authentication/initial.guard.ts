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

@Injectable()
export class InitialAuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);

    // Authentication: Verify the JWT token
    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          this.jwtConfiguration,
        );
        // Attach the payload to the request
        request[REQUEST_USER_KEY] = payload;
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException('Invalid or expired token.');
      }
    }

    return true;
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.cookies?.accessToken;

    return token;
  }
}
