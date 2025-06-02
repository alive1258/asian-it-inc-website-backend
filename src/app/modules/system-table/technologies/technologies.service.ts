import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from './entities/technology.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechnologiesService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  /**
   * On Module Init (create SocialSite)
   */
  async onModuleInit() {
    const staticData = [
      { name: 'Frontend' },
      { name: 'Backend' },
      { name: 'Full Stack' },
      { name: 'Hosting' },
      { name: 'CMS' },
      { name: 'UI/UX Design' },
      { name: 'DevOps' },
      { name: 'E-commerce' },
      { name: 'Mobile App Development' },
      { name: 'QA & Testing' },
      { name: 'Project Management' },
      { name: 'Database' },
    ];

    for (const data of staticData) {
      const exists = await this.technologyRepository.findOne({
        where: { name: data.name },
      });
      if (!exists) {
        await this.technologyRepository.save(data);
      }
    }
  }
  /**
   * Get all SocialSite
   */
  async findAll(): Promise<Technology[]> {
    return this.technologyRepository.find();
  }
}
