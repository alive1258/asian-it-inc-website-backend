import {
  BadRequestException,
  Injectable,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateFaqAnDto } from './dto/create-faq-an.dto';
import { UpdateFaqAnDto } from './dto/update-faq-an.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqAn } from './entities/faq-an.entity';
import { DataSource, Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetFaqAnswerDto } from './dto/get-faq-an.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class FaqAnsService {
  constructor(
    /**
     * inject repository
     */
    @InjectRepository(FaqAn)
    private readonly faqAnsRepository: Repository<FaqAn>,

    /**
     * Inject Services
     */
    private readonly fileUploadService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   *
   * @param createFaqAnDto create faq answer
   * @returns
   */
  public async create(
    req: Request,
    createFaqAnDto: CreateFaqAnDto,
  ): Promise<FaqAn> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new BadRequestException('User ID is required.You have to sing in!');
    }

    //check faq is already exist
    const existFaq = await this.faqAnsRepository.findOne({
      where: {
        answer: createFaqAnDto.answer,
        question: createFaqAnDto.question,
        faq_id: createFaqAnDto.faq_id,
      },
    });

    if (existFaq) {
      throw new BadRequestException('Faq already exist');
    }

    //create new faq ans
    let newFaqAns = this.faqAnsRepository.create({
      ...createFaqAnDto,
      added_by: user_id,
      faq_id: createFaqAnDto.faq_id,
    });
    //save the faq ans
    const result = await this.faqAnsRepository.save(newFaqAns);
    return result;
  }

  public async findAll(
    getFaqAnswerDto: GetFaqAnswerDto,
  ): Promise<IPagination<FaqAn>> {
    const searchableFields = ['question', 'answer'];
    // define relations
    const relations = ['faq'];

    const { page, limit, search, ...filters } = getFaqAnswerDto;
    const selectRelations = ['faq.headline', 'faq.photo'];
    const faqAns = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.faqAnsRepository,
      relations,
      selectRelations,
    });
    return faqAns;
  }

  public async findOne(id: string): Promise<FaqAn> {
    const faqAns = await this.faqAnsRepository.findOne({
      where: { id },
      relations: ['faq'],
    });

    if (!faqAns) {
      throw new BadRequestException('Faq not found');
    }

    return faqAns;
  }

  public async update(
    @Param('id', ParseIntPipe) id: number,
    updateFaqAnDto: UpdateFaqAnDto,
  ) {
    if (!id) {
      throw new BadRequestException('Faq ID is required. signing in!');
    }
    const faqAns = await this.faqAnsRepository.findOneBy({ id: id.toString() });

    if (!faqAns) {
      throw new BadRequestException('Faq not found');
    }
    Object.assign(faqAns, updateFaqAnDto);
    return await this.faqAnsRepository.save(faqAns);
  }

  public async remove(id: string): Promise<{ message: string }> {
    const faqAns = await this.findOne(id);
    if (!faqAns) {
      throw new BadRequestException('Faq not found');
    }
    await this.faqAnsRepository.remove(faqAns);
    return { message: `Faq Answer with ID ${id} has been removed` };
  }
}
