import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SmtpConfig } from './entities/smtp.entity';

@Injectable()
export class SmtpService {
  constructor(
    @InjectRepository(SmtpConfig)
    private readonly smtpConfigRepo: Repository<SmtpConfig>,
  ) {}
  async findOne(id?: number): Promise<SmtpConfig> {
    if (typeof id !== 'number') {
      throw new BadRequestException('SMTP configuration ID must be a number');
    }

    const entry = await this.smtpConfigRepo.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`SMTP configuration with ID ${id} not found`);
    }
    return entry;
  }
}
