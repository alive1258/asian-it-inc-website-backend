import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
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

    //inject findOneByEmailProvider
    private readonly findOneByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  //Create New user
  public async createUser(req: Request, createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(req, createUserDto);
  }

  findAll() {
    return `This action returns all users`;
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

  // Find a single user by email
  public async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findOneByEmail(email);
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }
    const existUser = await this.usersRepository.findOneBy({ id });

    if (!existUser) {
      throw new BadRequestException('User not found.');
    }

    // update user
    Object.assign(existUser, updateUserDto);

    // save updated user
    return await this.usersRepository.save(existUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
