import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePricingPlanFeatureDto } from './dto/create-pricing-plan-feature.dto';
import { UpdatePricingPlanFeatureDto } from './dto/update-pricing-plan-feature.dto';
import { PricingPlanFeature } from './entities/pricing-plan-feature.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { GetPricingPlanFeaturesDto } from './dto/get-pricing-plan-feature.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class PricingPlanFeaturesService {
  constructor(
    @InjectRepository(PricingPlanFeature)
    private readonly pricingPlanFeatureFeatureRepository: Repository<PricingPlanFeature>,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createPricingPlanFeatureDto: CreatePricingPlanFeatureDto,
  ): Promise<PricingPlanFeature> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.pricingPlanFeatureFeatureRepository.create({
      ...createPricingPlanFeatureDto,
      service_id: createPricingPlanFeatureDto.service_id,
      pricing_plan_id: createPricingPlanFeatureDto.pricing_plan_id,
      added_by: user_id,
    });
    return this.pricingPlanFeatureFeatureRepository.save(newEntry);
  }

  public async findAll(
    getPricingPlanFeaturesDto: GetPricingPlanFeaturesDto,
  ): Promise<IPagination<PricingPlanFeature>> {
    // Fields that can be searched by keyword
    const searchableFields = ['benefit'];
    const relations = ['service', 'pricingPlan'];
    const selectRelations = ['service.name', 'pricingPlan.name'];
    // const select = ['id', 'member_id', 'skill_id', 'created_at'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getPricingPlanFeaturesDto;

    // Query database using DataQueryService abstraction
    const pricingPlanFeature = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.pricingPlanFeatureFeatureRepository,
    });
    // check if collaborate is empty
    if (!pricingPlanFeature) {
      throw new BadRequestException('No pricingPlanFeature  data found');
    }
    return pricingPlanFeature;
  }

  public async findOne(id: string): Promise<PricingPlanFeature> {
    const pricingPlanFeature =
      await this.pricingPlanFeatureFeatureRepository.findOne({
        where: { id },
        //  relations: {
        //    service: true,
        //    planType: true,
        //  },
        relations: ['service', 'pricingPlan'],
        select: {
          service: {
            name: true,
          },
          pricingPlan: {
            id: true,
          },
        },
      });

    if (!pricingPlanFeature) {
      throw new NotFoundException('Why Choose data not found');
    }

    return pricingPlanFeature;
  }

  public async update(
    id: string,
    updatePricingPlanFeatureDto: UpdatePricingPlanFeatureDto,
  ): Promise<PricingPlanFeature> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('pricingPlanFeature Id is required');
    }

    // 2. Find the existing pricingPlanFeature entity by ID
    const pricingPlanFeature =
      await this.pricingPlanFeatureFeatureRepository.findOneBy({
        id,
      });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!pricingPlanFeature) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(pricingPlanFeature, updatePricingPlanFeatureDto);

    // 5. Save and return the updated entity
    return this.pricingPlanFeatureFeatureRepository.save(pricingPlanFeature);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('pricingPlanFeature ID is required');
    }
    const pricingPlanFeature = await this.findOne(id);

    await this.pricingPlanFeatureFeatureRepository.remove(pricingPlanFeature);

    return { message: 'pricingPlanFeature deleted successfully' };
  }
}
