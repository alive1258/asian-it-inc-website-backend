import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    /**
     * Inject the user repository to interact with the user database
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by their email address.
   * Throws an exception if the user does not exist or if there is an issue with the database.
   *
   * @param email The email address of the user to find
   * @returns The user entity if found
   * @throws BadRequestException if the user is not found
   * @throws RequestTimeoutException if there is a timeout or issue with the database query
   */
  public async findOneByEmail(email: string): Promise<User> {
    let user: User | null = null;

    try {
      // Try fetching the user by email from the repository
      user = await this.userRepository.findOneBy({ email: email });
    } catch (error) {
      // Catch any error during the database query and throw a RequestTimeoutException
      throw new RequestTimeoutException(error, {
        description:
          'Could not fetch the user due to a timeout or database error',
      });
    }

    // If no user is found with the given email, throw a BadRequestException
    if (!user) {
      throw new BadRequestException(
        'User with the provided email does not exist',
      );
    }

    // Return the found user if everything goes well
    return user;
  }
}
