import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  /**
   * Hashes the provided data.
   * @param data - The input data (string or Buffer) to be hashed.
   * @returns A promise that resolves to a hashed string.
   */
  abstract hashPassword(data: string | Buffer): Promise<string>;

  /**
   * Compares the provided data with an encrypted hash to check for a match.
   * @param data - The input data (string or Buffer) to compare.
   * @param encrypted - The previously hashed string for verification.
   * @returns A promise that resolves to `true` if the data matches the hash, otherwise `false`.
   */
  abstract comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
