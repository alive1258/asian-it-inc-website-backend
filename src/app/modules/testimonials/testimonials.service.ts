import {
  BadRequestException,
  Injectable,
  Param,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { GetTestimonialsDto } from './dto/get-testimonial.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class TestimonialsService {
  constructor(
    /**
     * Inject TypeORM repository for Testimonial entity
     */
    @InjectRepository(Testimonial)
    private readonly testimonialsRepository: Repository<Testimonial>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.testimonialsRepository.create({
      ...createTestimonialDto,
      client_id: createTestimonialDto.client_id,
      designation_id: createTestimonialDto.designation_id,
      service_id: createTestimonialDto.service_id,
      added_by: user_id,
    });
    return this.testimonialsRepository.save(newEntry);
  }

  public async findAll(
    getTestimonialsDto: GetTestimonialsDto,
  ): Promise<IPagination<Testimonial>> {
    // Fields that can be searched by keyword
    const searchableFields = ['review', 'comment'];
    const relations = ['client', 'service', 'designation'];
    const select = [
      'id',
      'client_id',
      'designation_id',
      'service_id',
      'review',
      'comment',
      'created_at',
    ];
    const selectRelations = ['client.name', 'service.name', 'designation.name'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getTestimonialsDto;

    // Query database using DataQueryService abstraction
    const testimonial = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      select,
      selectRelations,

      repository: this.testimonialsRepository,
    });
    // check if collaborate is empty
    if (!testimonial) {
      throw new BadRequestException('No Testimonial  data found');
    }
    return testimonial;
  }

  public async findOne(id: string): Promise<Testimonial> {
    const testimonials = await this.testimonialsRepository.findOne({
      where: { id },
    });

    if (!testimonials) {
      throw new BadRequestException('Testimonial not found');
    }

    return testimonials;
  }

  public async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<Testimonial> {
    if (!id) {
      throw new BadRequestException('Testimonial ID is required! signing in!');
    }
    //existing testimonial
    const testimonial = await this.testimonialsRepository.findOneBy({ id });
    if (!testimonial) {
      throw new BadRequestException('Testimonial not found!');
    }

    Object.assign(testimonial, updateTestimonialDto);
    return await this.testimonialsRepository.save(testimonial);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Testimonial ID is required');
    }
    const testimonial = await this.findOne(id);
    if (!testimonial) {
      throw new BadRequestException(`Testimonial   not found`);
    }
    await this.testimonialsRepository.remove(testimonial);
    return { message: `Testimonial  has been removed` };
  }
}
