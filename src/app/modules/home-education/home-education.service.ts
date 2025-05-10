import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateHomeEducationDto } from './dto/create-home-education.dto';
import { UpdateHomeEducationDto } from './dto/update-home-education.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeEducation } from './entities/home-education.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { GetHomeEducationDto } from './dto/get-home-education.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class HomeEducationService {
  constructor(
    @InjectRepository(HomeEducation)
    private homeEducationRepository: Repository<HomeEducation>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createHomeEducationDto: CreateHomeEducationDto,
  ): Promise<HomeEducation> {
    const user_id = req?.user?.sub;

    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 2. Check for duplicate record
    const existingData = await this.homeEducationRepository.findOne({
      where: {
        faculty_name: createHomeEducationDto.faculty_name,
      },
    });

    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEducation = this.homeEducationRepository.create({
      ...createHomeEducationDto,
      added_by: user_id,
    });

    return await this.homeEducationRepository.save(newEducation);
  }

  public async findAll(
    getHomeEducationDto: GetHomeEducationDto,
  ): Promise<IPagination<HomeEducation>> {
    const searchableFields = ['faculty_name'];

    const { page, limit, search, ...filters } = getHomeEducationDto;

    const homeEducations = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.homeEducationRepository,
    });

    // Check if results are empty
    if (!homeEducations) {
      throw new NotFoundException('No home education records found');
    }

    return homeEducations;
  }

  public async findOne(id: string): Promise<HomeEducation> {
    const homeEducation = await this.homeEducationRepository.findOne({
      where: {
        id,
      },
    });

    if (!homeEducation) {
      throw new NotFoundException('Home education not found');
    }

    return homeEducation;
  }

  public async update(
    id: string,
    updateHomeEducationDto: UpdateHomeEducationDto,
  ): Promise<HomeEducation> {
    if (!id) {
      throw new BadRequestException('Home education ID is required');
    }
    const homeEducation = await this.homeEducationRepository.findOneBy({ id });

    if (!homeEducation) {
      throw new NotFoundException('Home education not found');
    }

    Object.assign(homeEducation, updateHomeEducationDto);

    return await this.homeEducationRepository.save(homeEducation);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('home Education ID is required');
    }

    const homeEducation = await this.findOne(id);

    await this.homeEducationRepository.remove(homeEducation);

    return { message: 'Home education deleted successfully' };
  }
}
