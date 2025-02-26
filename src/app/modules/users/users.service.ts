import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { CreateUserProvider } from './providers/create-user.provider';

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
  ) {}

  //Create New user
  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
