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
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetPackagesDto } from './dto/get.packages.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Packages)
    private readonly packagesRepository: Repository<Packages>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(createPackageDto: CreatePackageDto): Promise<Packages> {
    const packages = this.packagesRepository.create(createPackageDto);
    return await this.packagesRepository.save(packages);
  }

  public async findAll(
    req: Request,
    getPackagesDto: GetPackagesDto,
  ): Promise<IPagination<Packages>> {
    const searchableFields = [
      'name',
      'package_type',
      'point',
      'family_group',
      'circle_group',
    ];

    const { page, limit, search, ...filters } = getPackagesDto;
    const members = this.dataQueryService.dataQuery({
      paginationQuery: {
        limit,
        page,
        search,
        filters,
      },
      searchableFields,
      repository: this.packagesRepository,
    });

    return members;
  }

  public async findOne(id: number) {
    const packages = this.packagesRepository.findOne({ where: { id } });
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
    // Fetch the existing member
    const packages = await this.packagesRepository.findOneBy({ id });
    // Check if the packages exists
    if (!packages) {
      throw new NotFoundException('Packages not found');
    }

    // Update the packages properties using Object.assign
    Object.assign(packages, updatePackageDto);

    // Save and return the updated packages
    return await this.packagesRepository.save(packages);
  }

  public async remove(id: number): Promise<{ message: string }> {
    const packages = await this.findOne(id);
    if (!packages) {
      throw new NotFoundException('Packages not found');
    }
    await this.packagesRepository.remove(packages);
    return { message: 'Packages has been deleted successfully.' };
  }
}
