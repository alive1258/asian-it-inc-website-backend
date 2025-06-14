import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkFlowDetailDto } from './dto/create-work-flow-detail.dto';
import { UpdateWorkFlowDetailDto } from './dto/update-work-flow-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkFlowDetail } from './entities/work-flow-detail.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetWorkFlowDetailDto } from './dto/get-work-flow-detail.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WorkFlowDetailsService {
  constructor(
    @InjectRepository(WorkFlowDetail)
    private readonly workFlowDetailRepository: Repository<WorkFlowDetail>,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createWorkFlowDetailDto: CreateWorkFlowDetailDto,
  ): Promise<WorkFlowDetail> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.workFlowDetailRepository.create({
      ...createWorkFlowDetailDto,
      work_flow_category_id: createWorkFlowDetailDto.work_flow_category_id,
      portfolio_id: createWorkFlowDetailDto.portfolio_id,
      added_by: user_id,
    });
    return this.workFlowDetailRepository.save(newEntry);
  }

  public async findAll(
    getWorkFlowDetailDto: GetWorkFlowDetailDto,
  ): Promise<IPagination<WorkFlowDetail>> {
    // Fields that can be searched by keyword
    const searchableFields = ['title', 'description'];
    const relations = ['workFlowCategory', 'portfolio'];
    // const selectRelations = ['service.name'];
    // const select = ['id', 'member_id', 'skill_id', 'created_at'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getWorkFlowDetailDto;

    // Query database using DataQueryService abstraction
    const workFlowDetail = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      // selectRelations,
      repository: this.workFlowDetailRepository,
    });
    // check if collaborate is empty
    if (!workFlowDetail) {
      throw new BadRequestException('No WorkFlowDetail  data found');
    }
    return workFlowDetail;
  }

  public async findOne(id: string): Promise<WorkFlowDetail> {
    const workFlowDetail = await this.workFlowDetailRepository.findOne({
      where: { id },
      relations: {
        workFlowCategory: true,
        portfolio: true,
      },
    });

    if (!workFlowDetail) {
      throw new NotFoundException('WorkFlowDetail data not found');
    }
    return workFlowDetail;
  }

  public async update(
    id: string,
    updateWorkFlowDetailDto: UpdateWorkFlowDetailDto,
  ): Promise<WorkFlowDetail> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('workFlowDetail Id is required');
    }

    // 2. Find the existing workFlowDetail entity by ID
    const workFlowDetail = await this.workFlowDetailRepository.findOneBy({
      id,
    });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!workFlowDetail) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(workFlowDetail, updateWorkFlowDetailDto);

    // 5. Save and return the updated entity
    return this.workFlowDetailRepository.save(workFlowDetail);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('workFlowDetail ID is required');
    }
    const workFlowDetail = await this.findOne(id);

    await this.workFlowDetailRepository.remove(workFlowDetail);

    return { message: 'workFlowDetail deleted successfully' };
  }
}
