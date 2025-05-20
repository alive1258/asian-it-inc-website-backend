import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class IpDeviceThrottlerGuard extends ThrottlerGuard {
  // Now it receives the request directly, returns Promise<string>
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const request = req as Request;

    // Get IP address
    const ip = request.ip || request.connection?.remoteAddress || '';

    // Get device ID (custom header or fallback to User-Agent)
    const deviceId =
      (request.headers['x-device-id'] as string) ||
      request.headers['user-agent'] ||
      'unknown-device';

    // Combine IP + DeviceId as key
    return `${ip}-${deviceId}`;
  }

  // Signature must match: accept context and throttler limit detail, return Promise<void>
  protected async throwThrottlingException(
    context: ExecutionContext,
    limit: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new ThrottlerException(
      'Too many requests from this device and IP. Please try again later.',
    );
  }
}
