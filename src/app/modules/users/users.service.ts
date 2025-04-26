import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { HashingProvider } from 'src/app/auth/providers/hashing.provider';
import { classToPlain } from 'class-transformer';
import { GetUsersDto } from './dto/get-users.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject Repositories
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    //Inject  profileConfig
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    //inject createUserProvider
    private readonly createUserProvider: CreateUserProvider,
    private readonly hashingProvider: HashingProvider,
    //inject findOneByEmailProvider
    private readonly findOneByEmailProvider: FindOneUserByEmailProvider,
    private readonly dataQueryService: DataQueryService,
  ) {}

  //Create New user
  public async createUser(req: Request, createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(req, createUserDto);
  }

  public async findAll(
    req: Request,
    getUsersDto: GetUsersDto,
  ): Promise<IPagination<User>> {
    // define searchableFields
    const searchableFields = ['email', 'mobile', 'name'];

    // define relations

    const { page, limit, search, ...filters } = getUsersDto;
    // Fetch groups with related user
    filters.is_verified = true;

    const members = this.dataQueryService.dataQuery({
      paginationQuery: {
        limit,
        page,
        search,
        filters,
      },
      searchableFields,
      repository: this.usersRepository,
    });

    return members;
  }

  /**
   * Get a single user by ID.
   */
  public async findOne(id: string) {
    // Validate the id
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }

    // Try to find the user in the repository
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    // If the user is not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  /**
   * Get single user
   */
  public async findOneForResendOTP(id: string): Promise<User> {
    // Validate the ID
    if (!id) {
      throw new BadRequestException('You have to provide User ID.');
    }

    // Fetch user with valid relations
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'mobile', 'role'],
    });

    // Throw error if user not found
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Find a single user by email
  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    // Throw error if user not found
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }

  //   Find a user by Id
  public async findOneById(id: string) {
    let user = undefined as User | null | undefined;
    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        `We are currently experiencing a temporary issue processing your request. Please try again later.`,
        {
          description:
            'Error connecting to the Database. Please try again later',
        },
      );
    }
    // handle the user dose not exist
    if (!user) {
      throw new BadRequestException(`The User dose not exist.`);
    }
    return user;
  }

  // Update a user by ID.
  public async update(id: string, updateUserDto: UpdateUserDto) {
    // Validate the ID

    // Check if the user exists
    const existUser = await this.usersRepository.findOneBy({ id });

    if (!existUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // updated password hashing
    if (updateUserDto?.password) {
      // If a new password is provided, hash it
      updateUserDto.password = await this.hashingProvider.hashPassword(
        updateUserDto.password,
      );
    }

    // Update the user properties
    Object.assign(existUser, updateUserDto);

    // Save and return the updated user
    return await this.usersRepository.save(existUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
