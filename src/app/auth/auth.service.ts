import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject SigInProvider
     */
    private readonly signInProvider: SignInProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
  public isAuth() {
    return true;
  }
}
