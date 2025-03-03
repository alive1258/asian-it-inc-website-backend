import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { OtpService } from './otp-send.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpSendModule {}
