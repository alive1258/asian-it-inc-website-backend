import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';

import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { PricingPlan } from './entities/pricing-plan.entity';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { GetPricingPlanDto } from './dto/get-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

@Injectable()
export class PricingPlansService {
  constructor(
    @InjectRepository(PricingPlan)
    private readonly pricingPlanRepository: Repository<PricingPlan>,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createPricingPlanDto: CreatePricingPlanDto,
  ): Promise<PricingPlan> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.pricingPlanRepository.create({
      ...createPricingPlanDto,
      service_id: createPricingPlanDto.service_id,
      plan_type_id: createPricingPlanDto.plan_type_id,
      added_by: user_id,
    });
    return this.pricingPlanRepository.save(newEntry);
  }

  public async findAll(
    getPricingPlanDto: GetPricingPlanDto,
  ): Promise<IPagination<PricingPlan>> {
    // Fields that can be searched by keyword
    const searchableFields = ['headline', 'price', 'regular_price'];
    const relations = ['service', 'planType'];
    const selectRelations = ['service.name', 'planType.name'];
    // const select = ['id', 'member_id', 'skill_id', 'created_at'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getPricingPlanDto;

    // Query database using DataQueryService abstraction
    const pricingPlan = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.pricingPlanRepository,
    });
    // check if collaborate is empty
    if (!pricingPlan) {
      throw new BadRequestException('No pricingPlan  data found');
    }
    return pricingPlan;
  }

  public async findOne(id: string): Promise<PricingPlan> {
    const pricingPlan = await this.pricingPlanRepository.findOne({
      where: { id },
      //  relations: {
      //    service: true,
      //    planType: true,
      //  },
      relations: ['service', 'planType'],
      select: {
        service: {
          name: true,
        },
        planType: {
          name: true,
        },
      },
    });

    if (!pricingPlan) {
      throw new NotFoundException('Why Choose data not found');
    }

    return pricingPlan;
  }

  public async update(
    id: string,
    updatePricingPlanDto: UpdatePricingPlanDto,
  ): Promise<PricingPlan> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('pricingPlan Id is required');
    }

    // 2. Find the existing pricingPlan entity by ID
    const pricingPlan = await this.pricingPlanRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!pricingPlan) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(pricingPlan, updatePricingPlanDto);

    // 5. Save and return the updated entity
    return this.pricingPlanRepository.save(pricingPlan);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('pricingPlan ID is required');
    }
    const pricingPlan = await this.findOne(id);

    await this.pricingPlanRepository.remove(pricingPlan);

    return { message: 'pricingPlan deleted successfully' };
  }
}
