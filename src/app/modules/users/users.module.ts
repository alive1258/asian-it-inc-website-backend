import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
  exports: [UsersService],
})
export class UsersModule {}
