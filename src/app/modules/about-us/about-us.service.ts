import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAboutUsDto } from './dtos/create-about-us.dto';
import { Request } from 'express';
import { AboutUs } from './entities/about-us.entity';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs)
    private readonly aboutUsRepository: Repository<AboutUs>,
  ) { }

  public async createOrUpdate(req: Request, createAboutUsDto: CreateAboutUsDto) {
    try {
      const user_id = req?.user?.sub;
      if (!user_id) {
        throw new UnauthorizedException('User not found');
      }

      const existing = await this.aboutUsRepository.findOne({
        where: { id: "1" },
      });

      if (existing) {
        // Update existing record
        await this.aboutUsRepository.update(existing.id, {
          ...createAboutUsDto,
          added_by: user_id,
        });

        return {
          message: 'About Us section updated successfully',
        };
      } else {
        // Create new record
        const newAboutUs = this.aboutUsRepository.create({
          ...createAboutUsDto,
          added_by: user_id,
        });

        await this.aboutUsRepository.save(newAboutUs);

        return {
          message: 'About Us section created successfully',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
