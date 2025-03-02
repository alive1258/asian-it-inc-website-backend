import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

import { ActiveUserData } from '../interface/active-user-data.interface';
import { User } from 'src/app/modules/users/entities/user.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    // inject JwtService
    private readonly jwtService: JwtService,

    // inject configurations
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigService: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfigService.audience,
        issuer: this.jwtConfigService.issuer,
        secret: this.jwtConfigService.secret,
        expiresIn: expiresIn,
      },
    );
  }
  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // generate the access token
      this.signToken<Partial<ActiveUserData>>(
        Number(user.id),
        this.jwtConfigService.accessTokenTtl,
        {
          email: user.email,
        },
      ),
      //generate the refresh token

      //   this.signToken(user.id, this.jwtConfigService.refreshTokenTtl),
      this.signToken(Number(user.id), this.jwtConfigService.refreshTokenTtl),
    ]);
    return { accessToken, refreshToken };
  }
}
