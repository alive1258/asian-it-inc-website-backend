import {
  Injectable,
  Controller,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCollaborateDto } from './dto/create-collaborate.dto';
import { UpdateCollaborateDto } from './dto/update-collaborate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Collaborate } from './entities/collaborate.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { GetCollaborateDto } from './dto/get-collaborate.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';

@Injectable()
export class CollaborateService {
  constructor(
    @InjectRepository(Collaborate)
    private readonly collaborateRepository: Repository<Collaborate>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createCollaborateDto: CreateCollaborateDto,
  ): Promise<Collaborate> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record
    const existingData = await this.collaborateRepository.findOne({
      where: {
        title: createCollaborateDto.title,
      },
    });
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newCollaborate = this.collaborateRepository.create({
      ...createCollaborateDto,
      added_by: user_id,
    });
    return await this.collaborateRepository.save(newCollaborate);
  }

  public async findAll(
    getCollaborateDto: GetCollaborateDto,
  ): Promise<IPagination<Collaborate>> {
    const searchableFields = ['title', 'description'];
    const { limit, page, search, ...filters } = getCollaborateDto;

    const collaborate = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.collaborateRepository,
    });
    // check if collaborate is empty
    if (!collaborate) {
      throw new BadRequestException('No data found');
    }
    return collaborate;
  }

  public async findOne(id: string): Promise<Collaborate> {
    const collaborate = await this.collaborateRepository.findOne({
      where: {
        id,
      },
    });
    if (!collaborate) {
      throw new BadRequestException('No data found');
    }
    return collaborate;
  }

  public async update(
    id: string,
    updateCollaborateDto: UpdateCollaborateDto,
  ): Promise<Collaborate> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    const collaborate = await this.collaborateRepository.findOneBy({ id });

    if (!collaborate) {
      throw new BadRequestException('No data found');
    }

    Object.assign(collaborate, updateCollaborateDto);
    return await this.collaborateRepository.save(collaborate);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('collaborate ID is required');
    }

    const homeEducation = await this.findOne(id);

    await this.collaborateRepository.remove(homeEducation);

    return { message: 'collaborate deleted successfully' };
  }
}
