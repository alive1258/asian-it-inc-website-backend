import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { HashingProvider } from 'src/app/auth/providers/hashing.provider';
import { Request } from 'express';
import { OtpService } from 'src/app/common/otp-send/otp-send.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,

    private readonly dataSource: DataSource, // For handling transactions
  ) {}

  /**
   * Creates a new user and sends OTP for verification.
   
   */
  public async createUser(
    req: Request,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    let existingUser: User | null;

    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.error(`Error checking existing user:`, error);
      throw new RequestTimeoutException(
        `We are currently experiencing a temporary issue. Please try again later.`,
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        `A user with the email ${createUserDto.email} already exists. Please use a different email or log in.`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hashedPassword = await this.hashingProvider.hashPassword(
        createUserDto.password,
      );

      let newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      newUser = await queryRunner.manager.save(newUser);

      // Send OTP for verification
      await this.otpService.sendOtp(newUser, queryRunner.manager);

      await queryRunner.commitTransaction();

      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Database Transaction Error:', error);

      throw new InternalServerErrorException(
        `There was an issue processing your request. Please try again later.`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
