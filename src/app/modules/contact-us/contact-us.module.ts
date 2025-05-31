import { Module } from '@nestjs/common';
import { ContactUsController } from './contact-us.controller';
import { ContactUsService } from './contact-us.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUs } from './entities/contact-us.entity';
import { ContactEmailVerificationOtp } from './entities/contact-email-verification-otp.entity';
import { ContactInfo } from './entities/contact-info.entity';

@Module({
  controllers: [ContactUsController],
  providers: [ContactUsService],
  imports: [TypeOrmModule.forFeature([ContactUs, ContactEmailVerificationOtp, ContactInfo])],

})
export class ContactUsModule { }
