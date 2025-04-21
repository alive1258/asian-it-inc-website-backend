import {
  BadRequestException,
  Injectable,
  Param,
  ParseIntPipe,
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

    /**
     * Inject Services
     */
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a new testimonial
   * @param createTestimonialDto - data for the new testimonial
   * @returns newly created testimonial
   */
  public async create(
    req: Request,
    createTestimonialDto: CreateTestimonialDto,
    file?: Express.Multer.File,
  ): Promise<Testimonial> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new BadRequestException('User ID is required.You have to sing in!');
    }

    // Handle file upload if file is present
    let photo: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    //create new testimonial
    let newTestimonials = this.testimonialsRepository.create({
      ...createTestimonialDto,
      added_by: user_id,
      photo: photo || undefined,
    });
    const result = await this.testimonialsRepository.save(newTestimonials);
    return result;
  }

  public findAll(
    getTestimonialsDto: GetTestimonialsDto,
  ): Promise<IPagination<Testimonial>> {
    const searchableFields = ['name', 'designation'];
    const { page, limit, search, ...filters } = getTestimonialsDto;
    const testimonials = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.testimonialsRepository,
    });
    return testimonials;
  }

  public async findOne(id: number): Promise<Testimonial> {
    const testimonials = await this.testimonialsRepository.findOne({
      where: { id: id.toString() },
    });

    if (!testimonials) {
      throw new BadRequestException('Testimonial not found');
    }

    return testimonials;
  }

  public async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
    file?: Express.Multer.File,
  ) {
    if (!id) {
      throw new BadRequestException('Testimonial ID is required! signing in!');
    }
    //existing testimonial
    const testimonial = await this.testimonialsRepository.findOneBy({ id });
    if (!testimonial) {
      throw new BadRequestException('Testimonial not found!');
    }

    let photo: string | string[] | undefined;
    if (file && testimonial.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: testimonial.photo,
        currentFile: file,
      });
    }

    if (file && !testimonial.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }
    updateTestimonialDto.photo = photo as string | undefined;
    Object.assign(testimonial, updateTestimonialDto);
    return await this.testimonialsRepository.save(testimonial);
  }

  public async remove(id: number): Promise<{ message: string }> {
    const testimonial = await this.findOne(id);
    if (!testimonial) {
      throw new BadRequestException(`Testimonial  ${id} not found`);
    }
    await this.testimonialsRepository.remove(testimonial);
    return { message: `Testimonial with ID ${id} has been removed` };
  }
}
