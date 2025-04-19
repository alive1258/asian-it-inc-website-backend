import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';
import { DataSource, Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { GetFaqDto } from './dto/get-faqs.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,

    /**
     * Inject Services
     */
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
    private readonly dataSource: DataSource,
  ) {}

  public async create(
    userId: string,
    createFaqDto: CreateFaqDto,
    file?: Express.Multer.File,
  ): Promise<Faq> {
    const user_id = userId;
    if (!user_id) {
      throw new BadRequestException('User ID is required.You have to sing in!');
    }

    //check faq is already exist
    const existFaq = await this.faqRepository.findOne({
      where: { headline: createFaqDto.headline },
    });

    if (existFaq) {
      throw new BadRequestException('Faq already exist');
    }
    // Handle file upload if file is present
    let photo: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }

    //create new faq
    let newFaq = this.faqRepository.create({
      ...createFaqDto,
      added_by: user_id,
      photo: photo || undefined,
    });

    const result = await this.faqRepository.save(newFaq);

    return result;
  }

  public async findAll(getFaqDto: GetFaqDto): Promise<IPagination<Faq>> {
    const searchableFields = ['headline'];

    const { page, limit, search, ...filters } = getFaqDto;

    const faqs = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.faqRepository,
    });

    return faqs;
  }

  public async findOne(id: number): Promise<Faq> {
    const faq = await this.faqRepository.findOne({
      where: { id: id.toString() },
    });
    if (!faq) {
      throw new BadRequestException('Faq not found');
    }
    return faq;
  }

  public async update(
    @Param('id', ParseIntPipe) id: number,
    updateFaqDto: UpdateFaqDto,
  ) {
    // validate id
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }

    // Fetch the existing faq

    const faq = await this.faqRepository.findOneBy({ id: id.toString() });

    // Check if the faq exists
    if (!faq) {
      throw new NotFoundException(`Faq dose not found`);
    }
    Object.assign(faq, updateFaqDto);

    // Save and return the updated faq
    return await this.faqRepository.save(faq);
  }

  public async remove(id: number): Promise<{ message: string }> {
    const faq = await this.findOne(id);
    if (!faq) {
      throw new NotFoundException(`Faq with ID ${id} not found`);
    }
    await this.faqRepository.remove(faq);
    return { message: `Faq with ID ${id} has been removed` };
  }
}
