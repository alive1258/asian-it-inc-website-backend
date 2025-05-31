import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateContactEmailVerificationDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;
}
