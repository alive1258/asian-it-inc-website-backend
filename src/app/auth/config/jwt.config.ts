import { registerAs } from '@nestjs/config';

/**
 * JWT Configuration
 * This configuration is namespaced under 'jwt' and can be accessed via ConfigService using `ConfigService.get('jwt')`.
 */
export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,

    // Default fallback is 3600 seconds = 1 hour
    accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),

    // Default fallback is 86400 seconds = 24 hours
    refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10),
  };
});
