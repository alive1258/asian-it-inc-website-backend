import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from './entities/otp.entity';
import { User } from 'src/app/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly userOTPRepository: Repository<OTP>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send OTP
   */
  public async sendOtp(user: User): Promise<OTP> {
    if (!user.mobile) {
      throw new BadRequestException('User mobile number is required.');
    }

    // Generate a secure random OTP
    const verify_code = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP securely
    const hashedOTP = await bcrypt.hash(verify_code, 10);

    let newOTPData = this.userOTPRepository.create({
      added_by: user.id,
      otp_code: hashedOTP,
      attempt: 1,
      expire_at: new Date(Date.now() + 60000), // Expires in 1 minute
    });

    try {
      newOTPData = await this.userOTPRepository.save(newOTPData);
    } catch (error) {
      throw new InternalServerErrorException('Could not save OTP data.');
    }

    try {
      // Send OTP via SMS
      await this.sendOtpViaSms(user.mobile, verify_code);
    } catch (error) {
      console.error('SMS Sending Error:', error);
      throw new RequestTimeoutException(
        'Failed to send OTP via SMS. Please try again later.',
      );
    }

    return newOTPData;
  }

  /**
   * Send OTP via SMS API using axios
   */
  private async sendOtpViaSms(
    phone: string,
    verify_code: string,
  ): Promise<void> {
    const messageContent = `Your Verify Code is ${verify_code}.`;
    const requestUrl = `${this.configService.get<string>('SMS_API_URL')}?apikey=${this.configService.get<string>('SMS_API_KEY')}&secretkey=${this.configService.get<string>('SMS_SECRET_KEY')}&callerID=${this.configService.get<string>('SMS_CALLER_ID')}&toUser=${phone}&messageContent=${encodeURIComponent(messageContent)}`;

    try {
      const response = await axios.get(requestUrl);

      // ✅ Check if SMS was successfully sent
      if (response.data.Status !== '0') {
        throw new InternalServerErrorException(
          'SMS API request failed: ' + JSON.stringify(response.data),
        );
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new RequestTimeoutException(
        'Failed to send OTP via SMS. Please try again later.',
      );
    }
  }

  /**
   * Send welcome sms message
   */
  public async sendWelcomeSms(user: User): Promise<void> {
    if (!user.mobile) {
      throw new BadRequestException('User mobile number is required.');
    }

    const message = `🎉 Welcome! Congratulations, your verification is completed. Enjoy our services!`;
    await this.sendOtpViaSms(user.mobile, message);
  }

  /**
   * Find many otp data
   */
  public async findManyWithId(added_by: string) {
    const result = await this.userOTPRepository.find({
      where: {
        added_by: added_by,
      },
    });
    return result;
  }
}
