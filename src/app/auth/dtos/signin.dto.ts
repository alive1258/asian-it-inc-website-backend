import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  /**
   * Email
   */
  @ApiProperty({
    description: 'Email',
    example: 'jondeo149518@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Password
   */
  @ApiProperty({
    description: 'Password',
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
