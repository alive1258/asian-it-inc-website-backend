import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  /**
   * oldPassword
   */
  @ApiProperty({
    description: 'oldPassword',
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty()
  old_password: string;
  /**
   * newPassword
   */
  @ApiProperty({
    description: 'newPassword',
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty()
  new_password: string;
  /**
   * confirmPassword
   */
  @ApiProperty({
    description: 'confirmPassword',
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
