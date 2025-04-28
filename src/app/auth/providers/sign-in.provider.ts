import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/app/modules/users/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/signin.dto';

import { GenerateTokensProvider } from './generate-tokens.provider';
import { MailService } from 'src/app/modules/mail/mail.service';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     *  Inject userService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    // Inject hashingPassword
    private readonly hashingProvider: HashingProvider,

    private readonly mailService: MailService,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // 1. Find user by email

    let user = await this.usersService.findOneByEmail(signInDto.email);

    //throw an exception user not found
    if (!user) {
      throw new NotFoundException("User couldn't found! Check your email.");
    }

    // 2. Check if user is verified
    if (user.is_verified === false) {
      throw new NotFoundException('User is not verified.');
    }

    //compare password to the hash
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not comparing passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    // 4. If login successful, resend OTP
    const result = await this.mailService.resendOtp(user);
    return result;
  }
}
