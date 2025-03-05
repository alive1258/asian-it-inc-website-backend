import {
  forwardRef,
  Inject,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/app/modules/users/users.service';
import { Request } from 'express';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    // inject generateTokenProvider
    private readonly generateTokensProvider: GenerateTokensProvider,

    // inject userService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async refreshTokens(refreshToken: string) {
    const reqUser =
      await this.generateTokensProvider.getUserIdByRefreshToken(refreshToken);

    try {
      const user = await this.usersService.findOne(reqUser.sub);

      const accessToken =
        await this.generateTokensProvider.generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    // return the new tokens
  }
}
