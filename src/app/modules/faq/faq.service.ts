import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetFaqDto } from './dto/get-faq.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(req: Request, createFaqDto: CreateFaqDto): Promise<Faq> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record
    const existingData = await this.faqRepository.findOne({
      where: {
        question: createFaqDto.question,
      },
    });
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.faqRepository.create({
      ...createFaqDto,
      added_by: user_id,
    });
    return this.faqRepository.save(newEntry);
  }
  // ✅ Public GET endpoint with pagination and search support

  public async findAll(getFaqDto: GetFaqDto): Promise<IPagination<Faq>> {
    // Fields that can be searched by keyword
    const searchableFields = ['question', 'answer'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getFaqDto;

    // Query database using DataQueryService abstraction
    const faq = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.faqRepository,
    });
    // check if collaborate is empty
    if (!faq) {
      throw new BadRequestException('No Home Hero  data found');
    }
    return faq;
  }
  // ✅ Public GET endpoint to retrieve a single Home Hero entry by ID
  public async findOne(id: string): Promise<Faq> {
    const faq = await this.faqRepository.findOne({
      where: {
        id,
      },
    });
    if (!faq) {
      throw new BadRequestException('home Hero No data found');
    }
    return faq;
  }

  // ✅ Public PATCH endpoint to update a Home Hero entry by ID
  public async update(id: string, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('faq Id is required');
    }

    // 2. Find the existing HomeHero entity by ID
    const faq = await this.faqRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!faq) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(faq, updateFaqDto);

    // 5. Save and return the updated entity
    return this.faqRepository.save(faq);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('faq ID is required');
    }

    const faq = await this.findOne(id);

    await this.faqRepository.remove(faq);

    return { message: 'faq deleted successfully' };
  }
}
