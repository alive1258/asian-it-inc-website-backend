import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Packages } from './entities/package.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Packages)
    private readonly membersRepository: Repository<Packages>,
  ) {}

  public async create(createPackageDto: CreatePackageDto): Promise<Packages> {
    const packages = this.membersRepository.create(createPackageDto);
    return await this.membersRepository.save(packages);
  }

  public async findAll(): Promise<Packages[]> {
    return await this.membersRepository.find();
  }

  public async findOne(id: number) {
    const packages = this.membersRepository.findOne({ where: { id } });
    if (!packages) {
      throw new NotFoundException('Packages not found');
    }
    return packages;
  }

  public async update(
    @Param('id', ParseIntPipe) id: number,
    updatePackageDto: UpdatePackageDto,
  ) {
    // validate id
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }
    // Fetch the existing Packages
    const packages = await this.findOne(id);
    // Check if the packages exists
    if (!packages) {
      throw new NotFoundException('Packages not found');
    }

    // Update the packages properties using Object.assign
    Object.assign(packages, updatePackageDto);

    // Save and return the updated packages
    return await this.membersRepository.save(packages);
  }

  public async remove(id: number): Promise<{ message: string }> {
    const packages = await this.findOne(id);
    if (!packages) {
      throw new NotFoundException('Packages not found');
    }
    await this.membersRepository.remove(packages);
    return { message: 'Packages has been deleted successfully.' };
  }
}
