import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * Hashes a given password or buffer using bcrypt. updte
   * @param data - The input data (string or Buffer) to hash.
   * @returns A promise that resolves to the hashed string.
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    // Generate a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);

    // Hash the input data using the generated salt
    return bcrypt.hash(data, salt);
  }
  /**
   * Compares a plain text password or buffer with an encrypted hash.
   * @param data - The input data (string or Buffer) to compare.
   * @param encrypted - The previously hashed string for comparison.
   * @returns A promise that resolves to `true` if the data matches the hash, otherwise `false`.
   */
  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
