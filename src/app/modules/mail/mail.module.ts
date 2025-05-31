// mail.module.ts
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { MailTransporter } from './providers/mailTransporter.provider';
import { SmtpModule } from '../smtp/smtp.module'; // ✅ Use module
import { ContactEmailVerificationOtp } from '../contact-us/entities/contact-email-verification-otp.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([OTP, ContactEmailVerificationOtp]),
    SmtpModule, // ✅ Required so MailModule can inject SmtpService
  ],
  providers: [MailService, MailTransporter],
  exports: [MailService],
})
export class MailModule { }
