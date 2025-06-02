import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWhyChooseDto } from './dto/create-why-choose.dto';
import { UpdateWhyChooseDto } from './dto/update-why-choose.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WhyChoose } from './entities/why-choose.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetWhyChooseDto } from './dto/get-why-choose.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WhyChooseService {
  constructor(
    @InjectRepository(WhyChoose)
    private readonly whyChooseRepository: Repository<WhyChoose>,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createWhyChooseDto: CreateWhyChooseDto,
  ): Promise<WhyChoose> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.whyChooseRepository.create({
      ...createWhyChooseDto,
      service_id: createWhyChooseDto.service_id,
      added_by: user_id,
    });
    return this.whyChooseRepository.save(newEntry);
  }

  public async findAll(
    getWhyChoose: GetWhyChooseDto,
  ): Promise<IPagination<WhyChoose>> {
    // Fields that can be searched by keyword
    const searchableFields = ['headline', 'description'];
    const relations = ['service'];
    const selectRelations = ['service.name'];
    // const select = ['id', 'member_id', 'skill_id', 'created_at'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getWhyChoose;

    // Query database using DataQueryService abstraction
    const whyChoose = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.whyChooseRepository,
    });
    // check if collaborate is empty
    if (!whyChoose) {
      throw new BadRequestException('No whyChoose  data found');
    }
    return whyChoose;
  }
  public async findOne(id: string): Promise<WhyChoose> {
    const whyChoose = await this.whyChooseRepository.findOne({
      where: { id },
      relations: {
        service: true,
      },
    });

    if (!whyChoose) {
      throw new NotFoundException('Why Choose data not found');
    }

    return whyChoose;
  }

  public async update(
    id: string,
    updateWhyChooseDto: UpdateWhyChooseDto,
  ): Promise<WhyChoose> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('whyChoose Id is required');
    }

    // 2. Find the existing whyChoose entity by ID
    const whyChoose = await this.whyChooseRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!whyChoose) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(whyChoose, updateWhyChooseDto);

    // 5. Save and return the updated entity
    return this.whyChooseRepository.save(whyChoose);
  }
  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('whyChoose ID is required');
    }
    const whyChoose = await this.findOne(id);

    await this.whyChooseRepository.remove(whyChoose);

    return { message: 'whyChoose deleted successfully' };
  }
}
