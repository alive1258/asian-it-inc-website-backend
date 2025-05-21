import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialSite } from './entities/social-site.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SocialSitesService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(SocialSite)
    private readonly socialSiteRepository: Repository<SocialSite>,
  ) {}

  /**
   * On Module Init (create SocialSite)
   */
  async onModuleInit() {
    const staticData = [
      { name: 'Facebook' },
      { name: 'Instagram' },
      { name: 'LinkedIn' },
      { name: 'Twitter' },
      { name: 'Judaism' },
      { name: 'Dribbble' },
      { name: 'Behance' },
      { name: 'Pinterest' },
      { name: 'YouTube' },
      { name: 'Medium' },
      { name: 'GitHub' },
      { name: 'Quora' },
    ];

    for (const data of staticData) {
      const exists = await this.socialSiteRepository.findOne({
        where: { name: data.name },
      });
      if (!exists) {
        await this.socialSiteRepository.save(data);
      }
    }
  }
  /**
   * Get all SocialSite
   */
  async findAll(): Promise<SocialSite[]> {
    return this.socialSiteRepository.find();
  }
}
