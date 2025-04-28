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
   * Name
   */
  @ApiProperty({
    description: 'Full Name of User',
    example: 'John Doe',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  /**
   * Mobile Number
   */
  @ApiProperty({
    description: 'Mobile Number of User',
    example: '+8801941221528',
    maxLength: 15,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @Matches(/^0[1-9]\d{9}$/)
  mobile?: string;

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
   * Role
   */
  @ApiPropertyOptional({
    description: 'User Role',
    example: 'admin',
  })
  @IsString()
  @IsOptional()
  @MaxLength(32)
  role?: string;

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
  @MinLength(6)
  @MaxLength(255)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
