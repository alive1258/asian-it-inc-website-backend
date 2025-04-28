import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { UserOTPDto } from './dtos/user-otp.dto';
import { VerifyOTPProvider } from './providers/veryfy-otp.provider';
import { UsersService } from '../modules/users/users.service';
import { OtpService } from '../common/otp-send/otp-send.service';
import { Request } from 'express';
import { UpdateUserDto } from '../modules/users/dto/update-user.dto';
import { User } from '../modules/users/entities/user.entity';
import { MailService } from '../modules/mail/mail.service';
import { ResetPasswordDto } from './dtos/reset-password.dtos';
import { HashingProvider } from './providers/hashing.provider';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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

    private readonly mailService: MailService,

    // Inject hashingPassword
    private readonly hashingProvider: HashingProvider,
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
  public async resendOTP(userId: string, email: string) {
    if (!userId || !email) {
      throw new BadRequestException(
        'Authentication failed. User ID or Email does not match.',
      );
    }

    //find the user
    let user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    //resend the otp
    const result = await this.mailService.resendOtp(user);
    return result;
  }

  // forget password
  public async forgetPassword(email: string) {
    if (!email) {
      throw new BadRequestException(
        'Authentication failed. User ID or Email does not match.',
      );
    }
    // find user from database
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException("User couldn't found! Check your email.");
    }
    //resend the otp
    const result = await this.mailService.resendOtp(user);
    return result;
  }

  // reset password
  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    userId: string,
  ) {
    //find the user from database
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User does not exist. SignIn first.');
    }
    const { old_password, new_password, confirm_password } = resetPasswordDto;
    // compare old password to the hash
    const isMatch = await this.hashingProvider.comparePassword(
      old_password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect.');
    }
    // Check if newPassword and confirmPassword match
    if (new_password !== confirm_password) {
      throw new BadRequestException(
        'New password and confirm password do not match.',
      );
    }
    // update password
    const hashedPassword =
      await this.hashingProvider.hashPassword(new_password);
    user.password = hashedPassword;

    // Save and return updated user
    return await this.usersRepository.save(user);
  }

  /**
   * Get me
   */
  public async getMe(req: Request): Promise<{ user: User }> {
    // get user id , company id and branch id from request
    // const { sub: user_id } = req?.user;
    const user_id = req?.user?.sub;
    // if (req?.user && 'sub' in req?.user) {
    //   const user_id = req.user.sub;
    //   // ...
    // }

    if (!user_id) {
      throw new BadRequestException('You have to Sign in.');
    }
    let result = {} as any;
    // Fetch user with valid relations
    const user = await this.usersService.findOneForResendOTP(user_id);

    result.user = user;

    return {
      user: result?.user,
    };
  }
}
