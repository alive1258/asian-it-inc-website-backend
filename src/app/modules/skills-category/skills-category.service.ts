import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSkillsCategoryDto } from './dto/create-skills-category.dto';
import { UpdateSkillsCategoryDto } from './dto/update-skills-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillsCategory } from './entities/skills-category.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetSkillsCategoryDto } from './dto/get-skills-category.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class SkillsCategoryService {
  constructor(
    @InjectRepository(SkillsCategory)
    private readonly skillsCategoryRepository: Repository<SkillsCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createSkillsCategoryDto: CreateSkillsCategoryDto,
  ): Promise<SkillsCategory> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    //2. check for duplicates
    const existingCategory = await this.skillsCategoryRepository.findOne({
      where: { title: createSkillsCategoryDto.title },
    });
    if (existingCategory) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    //3. Create a new category
    const newCategory = this.skillsCategoryRepository.create({
      ...createSkillsCategoryDto,
      added_by: user_id,
    });
    return await this.skillsCategoryRepository.save(newCategory);
  }

  public async findAll(
    GetSkillsCategoryDto: GetSkillsCategoryDto,
  ): Promise<IPagination<SkillsCategory>> {
    const searchableFields = ['title'];
    const { limit, page, search, ...filters } = GetSkillsCategoryDto;

    const skillsCategory = this.dataQueryService.dataQuery({
      paginationQuery: {
        limit,
        page,
        search,
        filters,
      },
      searchableFields,
      repository: this.skillsCategoryRepository,
    });
    //check if result empty
    if (!skillsCategory) {
      throw new BadRequestException('No records found');
    }
    return skillsCategory;
  }

  public async findOne(id: string): Promise<SkillsCategory> {
    const skillsCategory = await this.skillsCategoryRepository.findOne({
      where: { id },
    });
    if (!skillsCategory) {
      throw new BadRequestException('No record found');
    }
    return skillsCategory;
  }

  public async update(
    id: string,
    updateSkillsCategoryDto: UpdateSkillsCategoryDto,
  ): Promise<SkillsCategory> {
    if (!id) {
      throw new BadRequestException('Skills Category ID is required');
    }
    const skillsCategory = await this.skillsCategoryRepository.findOneBy({
      id,
    });
    if (!skillsCategory) {
      throw new BadRequestException('No record found');
    }
    Object.assign(skillsCategory, updateSkillsCategoryDto);
    return await this.skillsCategoryRepository.save(skillsCategory);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Skills Category ID is required');
    }

    const SkillsCategory = await this.findOne(id);

    await this.skillsCategoryRepository.remove(SkillsCategory);

    return { message: 'Skills Category deleted successfully' };
  }
}
