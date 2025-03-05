import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/app/modules/users/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/signin.dto';

import { GenerateTokensProvider } from './generate-tokens.provider';

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

    // inject generateTokenProvider
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    //throw an exception user not found
    let user = await this.usersService.findOneByEmail(signInDto.email);

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
    const result = await this.generateTokensProvider.generateTokens(user);

    return { tokens: result };
  }
}
