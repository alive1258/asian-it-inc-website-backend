import { Injectable } from '@nestjs/common';
import { SocialSite } from '../social-sites/entities/social-site.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanType } from './entities/plan-type.entity';

@Injectable()
export class PlanTypesService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(PlanType)
    private readonly planTypeRepository: Repository<PlanType>,
  ) {}

  /**
   * On Module Init (create SocialSite)
   */
  async onModuleInit() {
    const staticData = [
      { name: 'Starter Plan' },
      { name: 'Business Plan' },
      { name: 'Pro Plan' },
    ];

    for (const data of staticData) {
      const exists = await this.planTypeRepository.findOne({
        where: { name: data.name },
      });
      if (!exists) {
        await this.planTypeRepository.save(data);
      }
    }
  }
  /**
   * Get all SocialSite
   */
  async findAll(): Promise<SocialSite[]> {
    return this.planTypeRepository.find();
  }
}
