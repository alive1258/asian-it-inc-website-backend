import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserOTPDto {
  /**
   * User Id
   */
  @ApiProperty({
    description: 'User Id',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  /***
   * OTP Code
   */
  @ApiProperty({
    description: 'OTP Code',
  })
  @IsString()
  @IsNotEmpty()
  otp_code: string;
}
