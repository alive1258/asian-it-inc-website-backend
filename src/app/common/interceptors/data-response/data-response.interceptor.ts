import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // Set cookie only for login or refresh-token or verifyOTP route

        if (request.path === '/api/v1/auth/verify-otp') {
          response.cookie('refreshToken', data?.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            // domain: 'softxbd.com',
            path: '/',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 1, // (1 day in milliseconds)
          });
          response.cookie('accessToken', data?.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            // domain: 'softxbd.com',
            path: '/',
            secure: true,
            maxAge: 1000 * 60 * 60 * 1, // (1 hour in milliseconds)
          });

          // remove refresh token tokens
          delete data.refreshToken;
        }
        // if (request.path === '/api/v1/auth/sign-in') {
        //   response.cookie('refreshToken', data?.tokens?.refreshToken, {
        //     httpOnly: true,
        //     sameSite: 'none',
        //     // domain: 'softxbd.com',
        //     path: '/',
        //     secure: true,
        //     maxAge: 1000 * 60 * 60 * 24 * 1, // (1 day in milliseconds)
        //   });
        //   response.cookie('accessToken', data?.tokens?.accessToken, {
        //     httpOnly: true,
        //     sameSite: 'none',
        //     // domain: 'softxbd.com',
        //     path: '/',
        //     secure: true,
        //     maxAge: 1000 * 60 * 60 * 1, // (1 hour in milliseconds)
        //   });

        //   // remove refresh token tokens
        //   delete data.tokens;
        // }

        // set token when hit refresh token
        if (request.path === '/api/v1/auth/refresh-token') {
          response.cookie('accessToken', data?.accessToken, {
            httpOnly: true,
            // domain: 'softxbd.com',
            sameSite: 'none',
            path: '/',
            secure: true,
            maxAge: 1000 * 60 * 60 * 1, // (1 hour in milliseconds)
          });
          // remove tokens
          delete data.accessToken;
        }
        // clear cookie for logout
        if (request.path === '/api/v1/auth/sign-out') {
          response.clearCookie('refreshToken');
          response.clearCookie('accessToken');
        }

        // update admin token
        if (request.path === '/api/v1/auth/update-token') {
          response.cookie('refreshToken', data?.refreshToken, {
            httpOnly: true,
            // domain: 'softxbd.com',
            sameSite: 'none',
            path: '/',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 1, // (1 day in milliseconds)
          });
          response.cookie('accessToken', data?.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            // domain: 'softxbd.com',
            path: '/',
            secure: true,
            maxAge: 1000 * 60 * 60 * 1, // (1 hour in milliseconds)
          });

          // remove tokens
          delete data.refreshToken;
          delete data.accessToken;
          data.message = 'Token updated successfully!';
        }

        // update for newly created branch
        if (request.path === '/api/v1/auth/create-new-branch') {
          response.cookie('refreshToken', data?.refreshToken, {
            httpOnly: true,
            // domain: 'softxbd.com',
            sameSite: 'none',
            path: '/',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 1, // (1 day in milliseconds)
          });
          response.cookie('accessToken', data?.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            // domain: 'softxbd.com',
            path: '/',
            secure: true,
            maxAge: 1000 * 60 * 60 * 1, // (1 hour in milliseconds)
          });

          // remove tokens
          delete data.refreshToken;
          delete data.accessToken;
          data.message = 'Branch created successfully!';
        }

        return {
          apiVersion: this.configService.get('appConfig.apiVersion'),
          success: true,
          message: 'Operation Successful',
          status: HttpStatus.OK,
          data: data,
        };
      }),
    );
  }
}
