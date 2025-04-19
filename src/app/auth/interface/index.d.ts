import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user's decoded JWT payload.
       * This will be `null` if no valid token is present.
       */
      user: JwtPayload | null;
    }
  }
}
