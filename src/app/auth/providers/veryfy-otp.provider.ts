import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/app/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UserOTPDto } from '../dtos/user-otp.dto';
import { OtpService } from 'src/app/common/otp-send/otp-send.service';
import { MailService } from 'src/app/modules/mail/mail.service';

@Injectable()
export class VerifyOTPProvider {
  constructor(
    /**
     *  Inject userService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    // inject generateTokenProvider
    private readonly generateTokensProvider: GenerateTokensProvider,

    // private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  public async verifyOTP(userOTPDto: UserOTPDto) {
    //check the userOTPDto exist
    if (!userOTPDto.user_id || !userOTPDto.otp_code) {
      throw new BadRequestException(
        'Authentication failed. User ID or Email does not match.',
      );
    }
    //return the user
    const user = await this.usersService.findOneById(userOTPDto.user_id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // // get the userOTP dat from database
    // const userOTPRecords = await this.otpService.findManyWithId(
    //   userOTPDto.user_id,
    // );

    // get the userOTP data from database
    const userOTPRecords = await this.mailService.findManyWithId(
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

    // Update user verification
    await this.usersService.update(user.id, { is_verified: true });

    //send welcome sms

    await this.mailService.sendWelcomeMail(user);

    const tokens = await this.generateTokensProvider.generateTokens(user);

    return tokens;
  }
}
