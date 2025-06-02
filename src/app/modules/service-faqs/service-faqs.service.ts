import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { UpdateServiceFaqDto } from './dto/update-service-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceFaq } from './entities/service-faq.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetServiceFaqDto } from './dto/get-service-faq.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ServiceFaqsService {
  constructor(
    @InjectRepository(ServiceFaq)
    private readonly serviceFaqRepository: Repository<ServiceFaq>,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createServiceFaqDto: CreateServiceFaqDto,
  ): Promise<ServiceFaq> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.serviceFaqRepository.create({
      ...createServiceFaqDto,
      service_id: createServiceFaqDto.service_id,
      added_by: user_id,
    });
    return this.serviceFaqRepository.save(newEntry);
  }

  public async findAll(
    getServiceFaqDto: GetServiceFaqDto,
  ): Promise<IPagination<ServiceFaq>> {
    // Fields that can be searched by keyword
    const searchableFields = ['question', 'answer'];
    const relations = ['service'];
    const selectRelations = ['service.name'];
    // const select = ['id', 'member_id', 'skill_id', 'created_at'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getServiceFaqDto;

    // Query database using DataQueryService abstraction
    const serviceFaq = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.serviceFaqRepository,
    });
    // check if collaborate is empty
    if (!serviceFaq) {
      throw new BadRequestException('No serviceFaq  data found');
    }
    return serviceFaq;
  }

  public async findOne(id: string): Promise<ServiceFaq> {
    const serviceFaq = await this.serviceFaqRepository.findOne({
      where: { id },
      //  relations: ['service'],
      relations: {
        service: true,
      },
      select: {
        service: {
          name: true,
        },
      },
    });

    if (!serviceFaq) {
      throw new NotFoundException('service Faq data not found');
    }

    return serviceFaq;
  }

  public async update(
    id: string,
    updateServiceFaqDto: UpdateServiceFaqDto,
  ): Promise<ServiceFaq> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('serviceFaq Id is required');
    }

    // 2. Find the existing serviceFaq entity by ID
    const serviceFaq = await this.serviceFaqRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!serviceFaq) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(serviceFaq, updateServiceFaqDto);

    // 5. Save and return the updated entity
    return this.serviceFaqRepository.save(serviceFaq);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('serviceFaq ID is required');
    }
    const serviceFaq = await this.findOne(id);

    await this.serviceFaqRepository.remove(serviceFaq);

    return { message: 'serviceFaq deleted successfully' };
  }
}
