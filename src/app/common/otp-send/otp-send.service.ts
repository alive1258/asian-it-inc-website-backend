import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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
  public async sendOtp(user: User, entityManager: EntityManager): Promise<OTP> {
    if (!user.email) {
      throw new BadRequestException('User email is required.');
    }

    // Generate a secure random OTP
    const verify_code = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP securely
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(verify_code, salt);

    let newOTPData = entityManager.create(OTP, {
      added_by: user.id,
      otp_code: hashedOTP,
      attempt: 1,
      expire_at: new Date(Date.now() + 2 * 60 * 1000),
    });

    try {
      // Save OTP in the database
      const savedOTP = await entityManager.save(OTP, newOTPData);

      try {
        // Send OTP via SMS
        await this.sendOtpViaSms(user.email, verify_code);
      } catch (error) {
        console.error('SMS Sending Error:', error);
        throw new RequestTimeoutException(
          'Failed to send OTP via SMS. Please try again later.',
        );
      }

      return savedOTP;
    } catch (error) {
      console.error('Database Error:', error);
      throw new InternalServerErrorException('Could not save OTP data.');
    }
  }
  /**
   * ReSend OTP
   */
  public async reSendOtp(user: User): Promise<OTP> {
    if (!user.email) {
      throw new BadRequestException('User email  is required.');
    }

    // Generate a secure random OTP
    const verify_code = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP securely
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(verify_code, salt);

    const userOTPRecord = await this.userOTPRepository.findOne({
      where: {
        added_by: user.id,
      },
    });
    if (!userOTPRecord) {
      throw new BadRequestException('User not found.');
    }

    // update the otp info
    userOTPRecord.otp_code = hashedOTP;
    userOTPRecord.attempt = Number(userOTPRecord.attempt + 1);
    userOTPRecord.expire_at = new Date(Date.now() + 2 * 60 * 1000);

    try {
      await this.userOTPRepository.save(userOTPRecord);
    } catch (error) {
      throw new InternalServerErrorException('Could not save OTP data.');
    }

    try {
      // Send OTP via SMS
      await this.sendOtpViaSms(user.email, verify_code);
    } catch (error) {
      console.error('SMS Sending Error:', error);
      throw new RequestTimeoutException(
        'Failed to send OTP via SMS. Please try again later.',
      );
    }

    return userOTPRecord;
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

      if (!response.data || response.data.Status !== '0') {
        throw new InternalServerErrorException(
          `SMS API request failed: ${JSON.stringify(response.data)}`,
        );
      }

      // if (!response.data.Message_ID) {
      //   throw new InternalServerErrorException(
      //     'Message ID is missing in the response. OTP may not have been sent.',
      //   );
      // }
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
