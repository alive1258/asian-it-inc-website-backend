import { Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAboutUsDto } from './dtos/create-about-us.dto';
import { Request } from 'express';
import { AboutUs } from './entities/about-us.entity';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs)
    private readonly aboutUsRepository: Repository<AboutUs>,
    private readonly fileUploadsService: FileUploadsService,
  ) { }

  public async createOrUpdate(@Req() req: Request, createAboutUsDto: CreateAboutUsDto, file?: Express.Multer.File,) {
    try {
      const user_id = req?.user?.sub;
      if (!user_id) {
        throw new UnauthorizedException('User not found');
      }

      const existing = await this.aboutUsRepository.findOne({
        where: { id: "1" },
      });

      if (existing) {
        let banner_image: string | undefined;

        // 📤 Handle optional file upload
        if (file) {

          const uploaded = await this.fileUploadsService.fileUploads(file);
          // 📁 Use the uploaded thumbnail path (single or from array)
          banner_image = Array.isArray(uploaded) ? uploaded[0] : uploaded;
        }
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

  async findOne(): Promise<AboutUs> {
    const entry = await this.aboutUsRepository.findOne({ where: { id: "1" } });
    if (!entry) throw new NotFoundException('Entry not found');
    return entry;
  }
}
