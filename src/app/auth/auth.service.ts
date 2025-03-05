import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { UserOTPDto } from './dtos/user-otp.dto';
import { VerifyOTPProvider } from './providers/veryfy-otp.provider';
import { UsersService } from '../modules/users/users.service';
import { OtpService } from '../common/otp-send/otp-send.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject SigInProvider
     */
    private readonly signInProvider: SignInProvider,
    /**
     * Inject RefreshTokensProvider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider,
    /**
     * Inject verifyOTPProvider
     */
    private readonly verifyOTPProvider: VerifyOTPProvider,
    /**
     * Inject usersService
     */
    private readonly usersService: UsersService,
    /**
     * Inject otpService
     */
    private readonly otpService: OtpService,
  ) {}

  /**
   * Signs in a user by validating credentials and generating access tokens.
   * @param signInDto - The data transfer object containing user credentials.
   * @returns The generated authentication tokens or error message if invalid.
   */
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  /**
   * Refreshes the authentication tokens using a valid refresh token.
   * @param refreshTokenDto - The data transfer object containing the refresh token.
   * @returns The new access tokens if the refresh token is valid, or an error message.
   */
  public async refreshTokens(refreshToken: string) {
    return await this.refreshTokensProvider.refreshTokens(refreshToken);
  }

  /**
   * Verifies the One-Time Password (OTP) for multi-factor authentication.
   * @param userOTPDto - The data transfer object containing the OTP and other related information.
   * @returns Verification status or error message if OTP is invalid.
   */
  public async verifyOTP(userOTPDto: UserOTPDto) {
    return await this.verifyOTPProvider.verifyOTP(userOTPDto);
  }

  // reSendOTP
  public async resendOTP(userId: string, mobile: string) {
    if (!userId || !mobile) {
      throw new BadRequestException('Empty otp details are not allowed.');
    }
    //find the user
    let user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    //resend the otp
    const result = await this.otpService.reSendOtp(user);
    return result;
  }
}
