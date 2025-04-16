import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { MailTransporter } from './providers/mailTransporter.provider';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  providers: [MailService, MailTransporter],
  exports: [MailService],
})
export class MailModule {}
