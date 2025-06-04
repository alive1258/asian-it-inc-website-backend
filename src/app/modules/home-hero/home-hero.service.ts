import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateHomeHeroDto } from './dto/update-home-hero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeHero } from './entities/home-hero.entity';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CreateHomeHeroDto } from './dto/create-home-hero.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetHomeHeroDto } from './dto/get-home-hero.dto';

@Injectable()
export class HomeHeroService {
  constructor(
    @InjectRepository(HomeHero)
    private readonly homeHeroRepository: Repository<HomeHero>,
    private readonly dataQueryService: DataQueryService,
  ) { }

  public async create(
    req: Request,
    createHomeHeroDto: CreateHomeHeroDto,
  ): Promise<HomeHero> {
    const user_id = req?.user?.sub;

    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 2. Check for existing data (singleton pattern)
    const existingData = await this.homeHeroRepository.findOne({
      where: {},
      order: { id: 'ASC' }, // or 'DESC' for the last row
    });

    if (existingData) {
      // 3. Update the existing entry
      Object.assign(existingData, {
        ...createHomeHeroDto,
        updated_by: user_id, // optional if you track updates
      });

      return this.homeHeroRepository.save(existingData);
    }

    // 4. Create a new entry
    const newEntry = this.homeHeroRepository.create({
      ...createHomeHeroDto,
      added_by: user_id,
    });

    return this.homeHeroRepository.save(newEntry);
  }

  // ✅ Public GET endpoint with pagination and search support

  public async findAll(
    getHomeHeroDto: GetHomeHeroDto,
  ): Promise<IPagination<HomeHero>> {
    // Fields that can be searched by keyword
    const searchableFields = ['title', 'description'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getHomeHeroDto;

    // Query database using DataQueryService abstraction
    const homeHero = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.homeHeroRepository,
    });
    // check if collaborate is empty
    if (!homeHero) {
      throw new BadRequestException('No Home Hero  data found');
    }
    return homeHero;
  }

  // ✅ Public GET endpoint to retrieve a single Home Hero entry by ID
  public async findOne(): Promise<HomeHero> {
    const homeHero = await this.homeHeroRepository.findOne({
      where: {},
      order: { id: 'ASC' }, // or 'DESC' for the last row
    });
    if (!homeHero) {
      throw new BadRequestException('home Hero No data found');
    }
    return homeHero;
  }

  // ✅ Public PATCH endpoint to update a Home Hero entry by ID
  public async update(
    id: string,
    updateHomeHeroDto: UpdateHomeHeroDto,
  ): Promise<HomeHero> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('Home Hero Id is required');
    }

    // 2. Find the existing HomeHero entity by ID
    const homeHero = await this.homeHeroRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!homeHero) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(homeHero, updateHomeHeroDto);

    // 5. Save and return the updated entity
    return this.homeHeroRepository.save(homeHero);
  }

}
