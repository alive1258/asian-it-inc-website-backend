import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhyChoose } from './entities/why-choose-us.entity';
import { CreateWhyChooseDto } from './dtos/why-choose-us.dto';
import { Request } from 'express';
import { UpdateWhyChooseDto } from './dtos/update-why-choose.dto';


@Injectable()
export class WhyChooseUsService {
  constructor(
    @InjectRepository(WhyChoose)
    private readonly whyChooseRepo: Repository<WhyChoose>,
  ) { }

  async create(req: Request, dto: CreateWhyChooseDto): Promise<WhyChoose> {
    const entry = this.whyChooseRepo.create({ ...dto });
    return this.whyChooseRepo.save(entry);
  }

  async findAll(): Promise<WhyChoose[]> {
    return this.whyChooseRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<WhyChoose> {
    const entry = await this.whyChooseRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException('Entry not found');
    return entry;
  }

  async update(id: number, dto: UpdateWhyChooseDto): Promise<WhyChoose> {
    await this.whyChooseRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.whyChooseRepo.delete(id);
  }
}
