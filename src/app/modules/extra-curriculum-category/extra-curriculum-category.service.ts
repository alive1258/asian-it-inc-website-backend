import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExtraCurriculumCategoryDto } from './dto/create-extra-curriculum-category.dto';
import { UpdateExtraCurriculumCategoryDto } from './dto/update-extra-curriculum-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCurriculumCategory } from './entities/extra-curriculum-category.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetExtraCurriculumCategoryDto } from './dto/get-extra-curriculum-category.dto';

import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ExtraCurriculumCategoryService {
  constructor(
    @InjectRepository(ExtraCurriculumCategory)
    private readonly extraCurriculumCategoryRepository: Repository<ExtraCurriculumCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createExtraCurriculumCategoryDto: CreateExtraCurriculumCategoryDto,
  ): Promise<ExtraCurriculumCategory> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    //2. check for duplicates
    const existingCategory =
      await this.extraCurriculumCategoryRepository.findOne({
        where: { title: createExtraCurriculumCategoryDto.title },
      });

    if (existingCategory) {
      throw new BadRequestException(
        'extra Curriculum Category  record with the same data already exists.',
      );
    }

    //3. Create a new category
    const newCategory = this.extraCurriculumCategoryRepository.create({
      ...createExtraCurriculumCategoryDto,
      added_by: user_id,
    });
    return await this.extraCurriculumCategoryRepository.save(newCategory);
  }

  public async findAll(
    getExtraCurriculumCategoryDto: GetExtraCurriculumCategoryDto,
  ): Promise<IPagination<ExtraCurriculumCategory>> {
    const searchableFields = ['title'];
    const { limit, page, search, ...filters } = getExtraCurriculumCategoryDto;

    const extraCurriculumCategory = this.dataQueryService.dataQuery({
      paginationQuery: {
        limit,
        page,
        search,
        filters,
      },
      searchableFields,
      repository: this.extraCurriculumCategoryRepository,
    });
    //check if result empty
    if (!extraCurriculumCategory) {
      throw new BadRequestException('No records found');
    }
    return extraCurriculumCategory;
  }

  public async findOne(id: string): Promise<ExtraCurriculumCategory> {
    const extraCurriculumCategory =
      await this.extraCurriculumCategoryRepository.findOne({
        where: { id },
      });
    if (!extraCurriculumCategory) {
      throw new BadRequestException('extra Curriculum Category Not found');
    }
    return extraCurriculumCategory;
  }

  public async update(
    id: string,
    updateExtraCurriculumCategoryDto: UpdateExtraCurriculumCategoryDto,
  ): Promise<ExtraCurriculumCategory> {
    if (!id) {
      throw new BadRequestException('Snapshots Category ID is required');
    }
    const extraCurriculumCategory =
      await this.extraCurriculumCategoryRepository.findOneBy({
        id,
      });
    if (!extraCurriculumCategory) {
      throw new BadRequestException('No record found');
    }
    Object.assign(extraCurriculumCategory, updateExtraCurriculumCategoryDto);
    return await this.extraCurriculumCategoryRepository.save(
      extraCurriculumCategory,
    );
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException(
        'extra Curriculum Category Category ID is required',
      );
    }

    const extraCurriculumCategory = await this.findOne(id);

    await this.extraCurriculumCategoryRepository.remove(
      extraCurriculumCategory,
    );

    return { message: 'extra Curriculum Category deleted successfully' };
  }
}
