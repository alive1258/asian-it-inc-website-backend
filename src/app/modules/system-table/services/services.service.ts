import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  /**
   * On Module Init (create SocialSite)
   */
  async onModuleInit() {
    const staticData = [
      { name: 'Custom Website Development' },
      { name: 'E-Commerce Solutions' },
      { name: 'UI/UX Design & Prototyping' },
      { name: 'Web App Development' },
      { name: 'Mobile App Development' },
      { name: 'CMS Development' },
      { name: 'Shopify Theme Development' },
      { name: 'HTML Theme Development' },
      { name: 'Figma to HTML' },
      { name: 'Figma to React & Next Js' },
      { name: 'Next Js Theme Development' },
      { name: 'Admin Dashboard Development' },
    ];

    for (const data of staticData) {
      const exists = await this.serviceRepository.findOne({
        where: { name: data.name },
      });
      if (!exists) {
        await this.serviceRepository.save(data);
      }
    }
  }
  /**
   * Get all SocialSite
   */
  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }
}
