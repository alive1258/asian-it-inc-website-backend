import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dtos';
import { UserOTPDto } from './dtos/user-otp.dto';
import { OtpService } from '../common/otp-send/otp-send.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../modules/users/users.service';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject SigInProvider
     */
    private readonly signInProvider: SignInProvider,

    private readonly refreshTokensProvider: RefreshTokensProvider,

    private readonly usersService: UsersService,

    private readonly otpService: OtpService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }

  public async verifyOTP(userOTPDto: UserOTPDto) {
    //check the userOTPDto exist
    if (!userOTPDto.user_id || !userOTPDto.otp_code) {
      throw new BadRequestException('Empty otp details are not allowed.');
    }
    //return the user
    const user = await this.usersService.findOneById(userOTPDto.user_id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // get the userOTP dat from database
    const userOTPRecords = await this.otpService.findManyWithId(
      userOTPDto.user_id,
    );

    if (userOTPRecords.length <= 0) {
      throw new NotFoundException(
        "Account record doesn't exist or has been verified already. Please sign up or login",
      );
    }

    const { expire_at, otp_code: hashedOTP } = userOTPRecords[0];

    // Check the OTP expiration
    if (expire_at.getTime() < Date.now()) {
      // ✅ Fixed expiration check logic
      throw new BadRequestException('OTP has expired. Please request again.');
    }

    // Compare the otp
    const validOTP = await bcrypt.compare(userOTPDto.otp_code, hashedOTP);

    if (!validOTP) {
      throw new BadRequestException('Invalid code passed. Check your inbox');
    }
    //update user info
    user.is_verified = true;

    // Update user verification
    await this.usersService.update(user.id, user);

    //send welcome sms
    await this.otpService.sendWelcomeSms(user);

    const tokens = await this.generateTokensProvider.generateTokens(user);

    return tokens;
  }
}
