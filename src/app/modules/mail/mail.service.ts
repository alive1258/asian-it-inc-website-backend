import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailTransporter } from './providers/mailTransporter.provider';
import { Transporter } from 'nodemailer';
import { SmtpService } from '../smtp/smtp.service';
import { NotFoundError } from 'rxjs';
import { ContactEmailVerificationOtp } from '../contact-us/entities/contact-email-verification-otp.entity';

@Injectable()
export class MailService {
  constructor(
    /**
     * Inject userOTPRepository
     */

    @InjectRepository(OTP)
    private readonly userOTPRepository: Repository<OTP>,
    @InjectRepository(ContactEmailVerificationOtp)
    private readonly contactEmailVerificationOtpRepository: Repository<ContactEmailVerificationOtp>,
    private readonly smtpService: SmtpService, // ✅ works now

    /**
     * Inject mailTransporter
     */
    private mailTransporter: MailTransporter,
  ) {}

  /**
   * Send OTP
   */
  public async sendOtp(user: User, entityManager: EntityManager): Promise<OTP> {
    const manager = entityManager ?? this.userOTPRepository.manager;
    //generate random otp
    const otp_code = Math.floor(1000 + Math.random() * 9000).toString();

    //hash the otp
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(otp_code, salt);

    let newOtpDate = manager.create(OTP, {
      added_by: user.id,
      otp_code: hashedOTP,
      attempt: 1,
      expire_at: new Date(Date.now() + 60000),
    });

    try {
      newOtpDate = await manager.save(OTP, newOtpDate);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'The error from mail send.Could not save the otp data',
      });
    }

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; text-align: center;">
    <h2 style="color: #333;">Verify Your OTP</h2>
    <p style="font-size: 16px;">Your one-time password (OTP) is:</p>
    <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp_code}</p>
    <p style="font-size: 14px; color: #555;">Please use this OTP to complete your verification process.</p>
  </div>
`;

    await this.sendEmail({
      to: user.email,
      subject: 'Verify Your OTP',
      html: htmlContent,
      id: 1,
    });

    return newOtpDate;
  }

  /**
   * resent OTP
   */

  public async resendOtp(user: User): Promise<OTP> {
    //generate random otp

    const otp_code = Math.floor(1000 + Math.random() * 9000).toString();

    // find old otp
    let existOtp: OTP | null = null;

    try {
      existOtp = await this.userOTPRepository.findOne({
        where: {
          added_by: user.id,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the otp data',
      });
    }
    if (!existOtp) {
      throw new RequestTimeoutException(
        'No existing OTP found for this user.',
        {
          description: 'OTP not found',
        },
      );
    }

    // Get the current time
    const currentTime = new Date();

    // Check if 24 hours have passed since the last OTP attempt
    const timeDiff =
      currentTime.getTime() - new Date(existOtp.updated_at).getTime();
    const hoursPassed = timeDiff / (1000 * 3600); // in hours

    if (hoursPassed < 24 && existOtp.attempt >= 3) {
      // If user has attempted OTP 3 times within the last 24 hours, block them
      throw new RequestTimeoutException(
        'You have exceeded the limit of OTP attempts. Please try again after 24 hours.',
        {
          description: 'OTP attempt limit reached',
        },
      );
    }

    //hash the otp
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(otp_code, salt);

    // update otp info
    // existOtp.attempt = Number(existOtp.attempt) + 1;
    // existOtp.expire_at = new Date(Date.now() + 60000); // 1 minute from now
    // existOtp.otp_code = hashedOTP;

    // Update OTP information
    existOtp.attempt =
      existOtp.attempt >= 3 && hoursPassed < 24 ? existOtp.attempt : 1; // Reset if 24 hours passed
    existOtp.expire_at = new Date(Date.now() + 60000); // OTP expires in 1 minute
    existOtp.otp_code = hashedOTP;
    existOtp.updated_at = new Date(); // Update the time of the OTP attempt

    //save otp date

    try {
      await this.userOTPRepository.save(existOtp);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not save the otp data',
      });
    }

    // send email
    const htmlContent = `
   <div style="font-family: Arial, sans-serif; text-align: center;">
     <h2 style="color: #333;">Verify Your OTP</h2>
     <p style="font-size: 16px;">Your one-time password (OTP) is:</p>
     <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp_code}</p>
     <p style="font-size: 14px; color: #555;">Please use this OTP to complete your verification process.</p>
   </div>
 `;

    await this.sendEmail({
      to: user.email,
      subject: 'Verify Your OTP',
      html: htmlContent,
      id: 1,
    });

    return existOtp;
  }
  /**
   * Send welcome mail
   */

  public async sendWelcomeMail(user: User): Promise<void> {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2 style="color: #333;">Welcome!</h2>
      <p style="font-size: 16px;">Congratulations, your verification is completed!</p>
    </div>
  `;

    await this.sendEmail({
      to: user.email,
      subject: 'Verify Your OTP',
      html: htmlContent,
      id: 1,
    });
  }

  /**
   * Find many otp data
   */
  public async findManyWithId(added_by: string) {
    const result = await this.userOTPRepository.find({
      where: {
        added_by,
      },
    });

    return result;
  }

  /**
   *Custom sendMail function
   */
  public async sendEmail({
    to,
    subject,
    html,
    id,
  }: {
    to: string;
    subject: string;
    html: string;
    from?: string;
    id?: number;
  }): Promise<void> {
    try {
      const emailConfig = await this.smtpService.findOne(id);
      const transporter: Transporter =
        await this.mailTransporter.createTransporter(emailConfig);
      const result = await transporter.sendMail({
        from: `"Asianitinc"${emailConfig?.mail_username}`,
        to,
        subject,
        html,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(error, {
        description: "Can't send the email.",
      });
    }
  }

  public async contactEmailVerification(email: string) {
    try {
      const otp_code = Math.floor(1000 + Math.random() * 9000).toString();
      const htmlContent = `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h2 style="color: #333;">Verify Your Contact Request</h2>
    <p style="font-size: 16px;">
      Thank you for reaching out to us. To confirm your contact request, please use the following One-Time Password (OTP):
    </p>
    <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp_code}</p>
    <p style="font-size: 14px; color: #555;">
      Enter this OTP in the verification form to complete your request. This code is valid for a limited time.
    </p>
    <p style="font-size: 14px; color: #999; margin-top: 20px;">
      If you did not initiate this request, please ignore this email.
    </p>
  </div>
`;
      const expire_at = new Date(Date.now() + 60000);
      await this.contactEmailVerificationOtpRepository.save({
        email,
        otp_code,
        expire_at,
      });

      return await this.sendEmail({
        to: email,
        subject: 'Contact Email verification',
        html: htmlContent,
        id: 1,
      });
    } catch (error) {
      throw error;
    }
  }
}
