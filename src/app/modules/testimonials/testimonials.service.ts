import { Injectable } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';

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
    // Handle file upload if file is present
    let photo: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    //create new testimonial
    let newTestimonials = this.testimonialsRepository.create({
      ...createTestimonialDto,
      photo: photo || undefined,
    });
    const result = await this.testimonialsRepository.save(newTestimonials);
    return result;
  }

  findAll(): Promise<Testimonial[]> {
    return this.testimonialsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} testimonial`;
  }

  update(id: number, updateTestimonialDto: UpdateTestimonialDto) {
    return `This action updates a #${id} testimonial`;
  }

  remove(id: number) {
    return `This action removes a #${id} testimonial`;
  }
}
