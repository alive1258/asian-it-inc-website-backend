import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * Email
   */
  @ApiProperty({
    description: 'Email of User',
    example: '2EYw0@example.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsLowercase()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  /**
   * is_verified
   */

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  /**
   * Password
   */
  @Exclude()
  @IsString()
  @IsNotEmpty()
  password: string;
}
