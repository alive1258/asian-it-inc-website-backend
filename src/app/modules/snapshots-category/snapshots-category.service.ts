import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSnapshotsCategoryDto } from './dto/create-snapshots-category.dto';
import { UpdateSnapshotsCategoryDto } from './dto/update-snapshots-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SnapshotsCategory } from './entities/snapshots-category.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from './../../common/data-query/data-query.service';
import { Request } from 'express';
import { GetSnapshotsCategoryDto } from './dto/get-snapshots-category.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class SnapshotsCategoryService {
  constructor(
    @InjectRepository(SnapshotsCategory)
    private readonly snapshotsCategoryRepository: Repository<SnapshotsCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createSnapshotsCategoryDto: CreateSnapshotsCategoryDto,
  ): Promise<SnapshotsCategory> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    //2. check for duplicates
    const existingCategory = await this.snapshotsCategoryRepository.findOne({
      where: { title: createSnapshotsCategoryDto.title },
    });
    if (existingCategory) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    //3. Create a new category
    const newCategory = this.snapshotsCategoryRepository.create({
      ...createSnapshotsCategoryDto,
      added_by: user_id,
    });
    return await this.snapshotsCategoryRepository.save(newCategory);
  }

  public async findAll(
    GetSnapshotsCategoryDto: GetSnapshotsCategoryDto,
  ): Promise<IPagination<SnapshotsCategory>> {
    const searchableFields = ['title'];
    const { limit, page, search, ...filters } = GetSnapshotsCategoryDto;

    const snapshotsCategory = this.dataQueryService.dataQuery({
      paginationQuery: {
        limit,
        page,
        search,
        filters,
      },
      searchableFields,
      repository: this.snapshotsCategoryRepository,
    });
    //check if result empty
    if (!snapshotsCategory) {
      throw new BadRequestException('No records found');
    }
    return snapshotsCategory;
  }

  public async findOne(id: string): Promise<SnapshotsCategory> {
    const snapshotsCategory = await this.snapshotsCategoryRepository.findOne({
      where: { id },
    });
    if (!snapshotsCategory) {
      throw new BadRequestException('No record found');
    }
    return snapshotsCategory;
  }

  public async update(
    id: string,
    updateSnapshotsCategoryDto: UpdateSnapshotsCategoryDto,
  ): Promise<SnapshotsCategory> {
    if (!id) {
      throw new BadRequestException('Snapshots Category ID is required');
    }
    const snapshotsCategory = await this.snapshotsCategoryRepository.findOneBy({
      id,
    });
    if (!snapshotsCategory) {
      throw new BadRequestException('No record found');
    }
    Object.assign(snapshotsCategory, updateSnapshotsCategoryDto);
    return await this.snapshotsCategoryRepository.save(snapshotsCategory);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('snapshots Category ID is required');
    }

    const homeEducation = await this.findOne(id);

    await this.snapshotsCategoryRepository.remove(homeEducation);

    return { message: 'snapshots Category deleted successfully' };
  }
}
