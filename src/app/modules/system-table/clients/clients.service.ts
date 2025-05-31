import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(Client)
    private readonly serviceRepository: Repository<Client>,
  ) {}

  /**
   * On Module Init (create SocialSite)
   */
  async onModuleInit() {
    const staticData = [
      { name: 'Nayeem Hossain' },
      { name: 'Faria Rahman' },
      { name: 'Rakib Hasan' },
      { name: 'Sumaiya Akter' },
      { name: 'Tanvir Ahmed' },
      { name: 'Jannatul Ferdous' },
      { name: 'Sabbir Rahman' },
      { name: 'Nusrat Jahan' },
      { name: 'Arif Mahmud' },
      { name: 'Lamia Chowdhury' },
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
  async findAll(): Promise<Client[]> {
    return this.serviceRepository.find();
  }
}
