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
