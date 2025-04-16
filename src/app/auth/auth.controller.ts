import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

import { UserOTPDto } from './dtos/user-otp.dto';
import { Request } from 'express';
import { UpdateUserDto } from '../modules/users/dto/update-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    /**
     * inject auth service
     */
    private readonly authService: AuthService,
  ) {}

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Sing-in',
  })
  @ApiResponse({
    status: 201,
    description: 'Signed in successfully.',
  })
  public async SignIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  /**
   * Sign-out controller
   */
  @Post('sign-out')
  @ApiOperation({
    summary: 'Sing-Out',
  })
  @ApiResponse({
    status: 201,
    description: 'Signed out successfully.',
  })
  @HttpCode(HttpStatus.OK)
  public logOut() {
    // cookies are cleared in data interceptor.
    return {
      message: 'Successfully signed out.',
    };
  }
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async refreshTokens(@Req() req: Request) {
    //get refresh token form cookies
    const refreshToken = req.cookies?.refreshToken as string;
    //sign in
    return await this.authService.refreshTokens(refreshToken);
  }

  /**
   * Verify OTP controller
   */
  @Post('/verify-otp')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Verify OTP',
  })
  @ApiResponse({
    status: 201,
    description: 'Data fetched successfully.',
  })
  public verifyOTP(@Body() userOTPDto: UserOTPDto) {
    return this.authService.verifyOTP(userOTPDto);
  }

  /**
   * Resend OTP controller
   */
  @Post('/resend-otp')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Resend OTP',
  })
  @ApiResponse({
    status: 201,
    description: 'Data fetched successfully.',
  })
  public resendOTP(
    @Body() { userId, mobile }: { userId: string; mobile: string },
  ) {
    return this.authService.resendOTP(userId, mobile);
  }

  /**
   * Forget Password controller
   */
  @Post('/forget-password')
  @ApiOperation({
    summary: 'Forget Password',
  })
  @ApiResponse({
    status: 201,
    description: 'Data fetched successfully.',
  })
  public forgetPassword(
    @Body() { userId, mobile }: { userId: string; mobile: string },
  ) {
    return this.authService.forgetPassword(userId, mobile);
  }

  /**
   * Reset Password controller
   */
  @Post('/reset-password')
  @ApiOperation({
    summary: 'Reset Password',
  })
  @ApiResponse({
    status: 201,
    description: 'Data fetched successfully.',
  })
  public resetPassword(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const id = req.user?.sub;
    if (!id) {
      throw new BadRequestException('User ID is missing.');
    }

    return this.authService.resetPassword(updateUserDto, id);
  }

  /**
   * Get me controller
   */
  @Get('/get-me')
  @ApiOperation({
    summary: 'Get single data.',
  })
  getMe(@Req() req: Request) {
    return this.authService.getMe(req);
  }
}
