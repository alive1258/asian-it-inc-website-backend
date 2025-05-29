// import {
//   Injectable,
//   ExecutionContext,
//   Inject,
//   UnauthorizedException,
// } from '@nestjs/common';
// import {
//   ThrottlerGuard,
//   ThrottlerModuleOptions,
//   ThrottlerStorage,
//   ThrottlerException,
//   ThrottlerRequest,
//   ThrottlerLimitDetail,
// } from '@nestjs/throttler';
// import { Reflector } from '@nestjs/core';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
// import { Request } from 'express';

// // ✅ Use your own minimal interface
// interface IpDeviceRequest {
//   ip: string;
//   deviceId: string;
// }

// @Injectable()
// export class IpDeviceThrottlerGuard extends ThrottlerGuard {
//   constructor(
//     @Inject(CACHE_MANAGER) private cacheManager: Cache,
//     @Inject(ThrottlerStorage) private storage: ThrottlerStorage,

//     reflector: Reflector,
//     storageService: ThrottlerStorage,
//     options: ThrottlerModuleOptions,
//   ) {
//     super(options, storageService, reflector);
//   }

//   protected getRequestResponsePairs(
//     context: ExecutionContext,
//   ): Array<{ req: IpDeviceRequest; res: any }> {
//     const req = context.switchToHttp().getRequest<Request>();
//     const ip = req.ip || req.connection?.remoteAddress || '';
//     const deviceId =
//       (req.headers['x-device-id'] as string) ||
//       req.headers['user-agent'] ||
//       'unknown-device';

//     const requestProps: IpDeviceRequest = {
//       ip,
//       deviceId,
//     };

//     const res = context.switchToHttp().getResponse();

//     return [{ req: requestProps, res }];
//   }

//   protected async handleRequest(
//     requestProps: ThrottlerRequest,
//   ): Promise<boolean> {
//     // Extract IP and deviceId from the request object
//     const req = requestProps as unknown as Request;
//     const ip = req.ip || req.connection?.remoteAddress || '';
//     const deviceId =
//       (req.headers['x-device-id'] as string) ||
//       req.headers['user-agent'] ||
//       'unknown-device';

//     const tracker = `${ip}-${deviceId}`;
//     const blockedKey = `blocked:${tracker}`;
//     const attemptKey = `attempts:${tracker}`;

//     const isBlocked = await this.cacheManager.get(blockedKey);
//     if (isBlocked) {
//       throw new UnauthorizedException(
//         'You are temporarily blocked for 24 hours due to multiple failed attempts.',
//       );
//     }

//     const attempts = (await this.cacheManager.get<number>(attemptKey)) || 0;

//     if (attempts >= 2) {
//       await this.cacheManager.set(blockedKey, true, 60 * 60 * 24);
//       await this.cacheManager.del(attemptKey);
//       throw new UnauthorizedException(
//         'Too many attempts. You are blocked for 24 hours.',
//       );
//     } else {
//       await this.cacheManager.set(attemptKey, attempts + 1, 180);
//     }

//     return true;
//   }

//   protected async throwThrottlingException(
//     context: ExecutionContext,
//     limit: ThrottlerLimitDetail,
//   ): Promise<void> {
//     throw new ThrottlerException(
//       'Too many requests from this device and IP. Please try again later.',
//     );
//   }
// }

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class IpDeviceThrottlerGuard extends ThrottlerGuard {
  private attempts: Record<string, { count: number; firstTryAt: number }> = {};
  private blocked: Record<string, number> = {};

  protected async getTracker(
    req: Record<string, any> | Request,
  ): Promise<string> {
    const request = req as Request;

    // 🛡️ Fallback protection for missing headers
    const ip =
      request?.ip || request?.connection?.remoteAddress || 'unknown-ip';

    const headers = request?.headers || {};
    const deviceId =
      (headers['x-device-id'] as string) ||
      headers['user-agent'] ||
      'unknown-device';

    return `${ip}-${deviceId}`;
  }

  // protected async handleRequest(
  //   requestProps: import('@nestjs/throttler').ThrottlerRequest,
  // ): Promise<boolean> {
  //   const request = requestProps as unknown as Request;
  //   const tracker = await this.getTracker(request);

  //   const now = Date.now();
  //   const blockTime = this.blocked[tracker];

  //   // Check if blocked for 24 hours (86400000 ms)
  //   if (blockTime && now < blockTime) {
  //     throw new UnauthorizedException(
  //       'You are blocked for 24 hours due to too many attempts.',
  //     );
  //   }

  //   // Clear block if expired
  //   if (blockTime && now >= blockTime) {
  //     delete this.blocked[tracker];
  //     delete this.attempts[tracker];
  //   }

  //   const attempt = this.attempts[tracker];

  //   if (!attempt) {
  //     // First attempt
  //     this.attempts[tracker] = { count: 1, firstTryAt: now };
  //   } else {
  //     const elapsed = now - attempt.firstTryAt;

  //     if (elapsed < 3 * 60 * 1000) {
  //       // Still in 3-minute window
  //       attempt.count += 1;

  //       if (attempt.count > 2) {
  //         // Block for 24 hours
  //         this.blocked[tracker] = now + 24 * 60 * 60 * 1000;
  //         delete this.attempts[tracker];

  //         throw new UnauthorizedException(
  //           'Too many attempts. You are blocked for 24 hours.',
  //         );
  //       }
  //     } else {
  //       // Reset if more than 3 minutes passed
  //       this.attempts[tracker] = { count: 1, firstTryAt: now };
  //     }
  //   }

  //   return true;
  // }

  protected async handleRequest(
    request: Record<string, any>,
  ): Promise<boolean> {
    const tracker = await this.getTracker(request); // this will now be safe

    const now = Date.now();
    const blockTime = this.blocked[tracker];

    if (blockTime && now < blockTime) {
      throw new UnauthorizedException(
        'You are blocked for 24 hours due to too many attempts.',
      );
    }

    if (blockTime && now >= blockTime) {
      delete this.blocked[tracker];
      delete this.attempts[tracker];
    }

    const attempt = this.attempts[tracker];

    if (!attempt) {
      this.attempts[tracker] = { count: 1, firstTryAt: now };
    } else {
      const elapsed = now - attempt.firstTryAt;

      if (elapsed < 3 * 60 * 1000) {
        attempt.count += 1;

        if (attempt.count > 20) {
          this.blocked[tracker] = now + 24 * 60 * 60 * 1000;
          delete this.attempts[tracker];

          throw new UnauthorizedException(
            'Too many attempts. You are blocked for 24 hours.',
          );
        }
      } else {
        this.attempts[tracker] = { count: 1, firstTryAt: now };
      }
    }

    return true;
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    limit: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new ThrottlerException(
      'Too many requests from this device and IP. Please try again later.',
    );
  }
}

// import {
//   Injectable,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import {
//   ThrottlerGuard,
//   ThrottlerException,
//   ThrottlerLimitDetail,
//   ThrottlerRequest,
// } from '@nestjs/throttler';
// import Redis from 'ioredis';
// import { Request } from 'express';

// @Injectable()
// export class IpDeviceThrottlerGuard extends ThrottlerGuard {
//   private redis = new Redis(); // Connect to Redis

//   protected async getTracker(req: Record<string, any>): Promise<string> {
//     const request = req as Request;
//     const ip = request.ip || request.connection?.remoteAddress || '';
//     const deviceId =
//       (request.headers['x-device-id'] as string) ||
//       request.headers['user-agent'] ||
//       'unknown-device';

//     return `${ip}-${deviceId}`;
//   }

//   // ✅ Correct method signature for `handleRequest`
//   protected async handleRequest(request: ThrottlerRequest): Promise<boolean> {
//     const req = request as unknown as Request;
//     const tracker = await this.getTracker(req);

//     const blockedKey = `blocked:${tracker}`;
//     const attemptKey = `attempts:${tracker}`;

//     const isBlocked = await this.redis.get(blockedKey);
//     if (isBlocked) {
//       throw new UnauthorizedException(
//         'You have been blocked for 24 hours due to repeated requests.',
//       );
//     }

//     const attempts = await this.redis.incr(attemptKey);
//     if (attempts === 1) {
//       await this.redis.expire(attemptKey, 180); // 3 minutes
//     }

//     if (attempts > 2) {
//       await this.redis.set(blockedKey, 'true', 'EX', 60 * 60 * 24); // 24 hours
//       throw new UnauthorizedException(
//         'Too many attempts. You are blocked for 24 hours.',
//       );
//     }

//     return true;
//   }

//   protected async throwThrottlingException(
//     context: ExecutionContext,
//     limit: ThrottlerLimitDetail,
//   ): Promise<void> {
//     throw new ThrottlerException(
//       'Too many requests from this device and IP. Please try again later.',
//     );
//   }
// }

// import { Injectable, ExecutionContext } from '@nestjs/common';
// import {
//   ThrottlerException,
//   ThrottlerGuard,
//   ThrottlerLimitDetail,
// } from '@nestjs/throttler';
// import { Request } from 'express';

// @Injectable()
// export class IpDeviceThrottlerGuard extends ThrottlerGuard {
//   // Now it receives the request directly, returns Promise<string>
//   protected async getTracker(req: Record<string, any>): Promise<string> {
//     const request = req as Request;

//     // Get IP address
//     const ip = request.ip || request.connection?.remoteAddress || '';

//     // Get device ID (custom header or fallback to User-Agent)
//     const deviceId =
//       (request.headers['x-device-id'] as string) ||
//       request.headers['user-agent'] ||
//       'unknown-device';

//     // Combine IP + DeviceId as key
//     return `${ip}-${deviceId}`;
//   }

//   // Signature must match: accept context and throttler limit detail, return Promise<void>
//   protected async throwThrottlingException(
//     context: ExecutionContext,
//     limit: ThrottlerLimitDetail,
//   ): Promise<void> {
//     throw new ThrottlerException(
//       'Too many requests from this device and IP. Please try again later.',
//     );
//   }
// }
