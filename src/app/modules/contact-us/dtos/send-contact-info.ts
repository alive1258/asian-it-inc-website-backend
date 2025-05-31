import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendContactInfoDto {
  @ApiProperty({ example: 'Full name' })
  @IsString()
  full_name: string;

  @ApiProperty({ example: '012541' })
  @IsString()
  phone_number: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'website development' })
  @IsString()
  service_type: string;

  @ApiProperty({ example: 'Enter message' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'Enter otp' })
  @IsString()
  otp_code: string;
}
