import { forwardRef, Global, Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { AuthService } from './auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptProvider } from './providers/bcrypt.provider';
import { AuthController } from './auth.controller';
import { SignInProvider } from './providers/sign-in.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { OtpSendModule } from '../common/otp-send/otp-send.module';
import { VerifyOTPProvider } from './providers/veryfy-otp.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    VerifyOTPProvider,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    OtpSendModule,
    TypeOrmModule.forFeature([User]),
  ],
  exports: [AuthService, HashingProvider, JwtModule, ConfigModule],
})
export class AuthModule {}
