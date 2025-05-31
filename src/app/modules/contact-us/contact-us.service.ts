import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactUs } from './entities/contact-us.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CreateContactUsDto } from './dtos/contact-us.dto';
import { MailService } from '../mail/mail.service';
import { CreateContactEmailVerificationDto } from './dtos/contact-email-verification.dto';
import { SendContactInfoDto } from './dtos/send-contact-info';
import { ContactEmailVerificationOtp } from './entities/contact-email-verification-otp.entity';
import { error } from 'console';
import { ContactInfo } from './entities/contact-info.entity';

@Injectable()
export class ContactUsService {

  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
    @InjectRepository(ContactEmailVerificationOtp)
    private readonly contactEmailVerificationOtpRepository: Repository<ContactEmailVerificationOtp>,
    @InjectRepository(ContactInfo)
    private readonly contactInfoRepository: Repository<ContactInfo>,
    private readonly mailService: MailService
  ) { }


  public async createOrUpdate(@Req() req: Request, dto: CreateContactUsDto) {
    try {
      const user_id = req?.user?.sub;
      if (!user_id) {
        throw new UnauthorizedException('User not found');
      }

      const existing = await this.contactUsRepository.findOne({
        where: { id: 1 },
      });

      if (existing) {
        // Update existing record
        await this.contactUsRepository.update(existing.id, {
          ...dto,
          added_by: user_id,
        });

        return {
          message: 'Contact Us section updated successfully',
        };
      } else {
        // Create new record
        const newAboutUs = this.contactUsRepository.create({
          ...dto,
          added_by: user_id,
        });

        await this.contactUsRepository.save(newAboutUs);

        return {
          message: 'Contact Us section created successfully',
        };
      }
    } catch (error) {
      throw error;
    }
  }


  async findOne(): Promise<ContactUs> {
    const entry = await this.contactUsRepository.findOne({ where: { id: 1 } });
    if (!entry) throw new NotFoundException('Entry not found');
    return entry;
  }

  // contact us email response

  async contactEmailVerification(dto: CreateContactEmailVerificationDto) {
    try {
      await this.mailService.contactEmailVerification(dto.email)
      // Return success response
      return { message: 'Verification email sent successfully' };
    } catch (error) {
      throw error;
    }
  }


  async sendContactInfo(dto: SendContactInfoDto) {
    try {
      const existingOtp = await this.contactEmailVerificationOtpRepository.findOne({
        where: { email: dto.email },
      });

      // Check if OTP exists
      if (!existingOtp) {
        throw new NotFoundException("OTP not found for this email.");
      }

      // Check if OTP has expired
      const now = new Date();
      if (existingOtp.expire_at < now) {
        throw new BadRequestException("OTP has expired. Please request a new one.");
      }

      // Check if OTP matches
      if (existingOtp.otp_code !== dto.otp_code) {
        throw new BadRequestException("Invalid OTP code.");
      }

      // Optionally delete or mark OTP as used after success
      await this.contactEmailVerificationOtpRepository.delete({ email: dto.email });
      await this.contactInfoRepository.save({
        ...dto
      })
      return {
        message: "OTP verified successfully.",
      };

    } catch (error) {
      // Handle known NestJS exceptions or rethrow others
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to verify OTP.");
    }
  }





}
