import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAboutMeDto } from './dto/create-about-me.dto';
import { UpdateAboutMeDto } from './dto/update-about-me.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AboutMe } from './entities/about-me.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetAboutMeDto } from './dto/get-about-me.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class AboutMeService {
  constructor(
    @InjectRepository(AboutMe)
    private readonly aboutMeRepository: Repository<AboutMe>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    @Req() req: Request,
    createAboutMeDto: CreateAboutMeDto,
    file?: Express.Multer.File,
  ): Promise<AboutMe> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    const existAboutMe = await this.aboutMeRepository.findOne({
      where: { title: createAboutMeDto.title },
    });

    if (existAboutMe) {
      throw new BadRequestException('About Me already exists');
    }

    let photo: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    //create new AboutMe

    let newAboutMe = this.aboutMeRepository.create({
      ...createAboutMeDto,
      added_by: user_id,
      photo,
    });

    const result = await this.aboutMeRepository.save(newAboutMe);
    return result;
  }

  public async findAll(
    getAboutMeDto: GetAboutMeDto,
  ): Promise<IPagination<AboutMe>> {
    const searchableFields = ['title', 'description', 'sub_title', 'skills'];

    const { page, limit, search, ...filters } = getAboutMeDto;

    const aboutMe = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.aboutMeRepository,
    });

    return aboutMe;
  }

  public async findOne(id: string): Promise<AboutMe> {
    const aboutMe = await this.aboutMeRepository.findOne({
      where: { id },
    });
    if (!aboutMe) {
      throw new NotFoundException('About Me not found');
    }
    return aboutMe;
  }

  public async update(
    id: string,
    updateAboutMeDto: UpdateAboutMeDto,
    file?: Express.Multer.File,
  ): Promise<AboutMe> {
    if (!id) {
      throw new BadRequestException('About Me ID is required');
    }

    const existAboutMe = await this.aboutMeRepository.findOneBy({ id });
    if (!existAboutMe) {
      throw new NotFoundException('About Me not found');
    }

    let photo: string | string[] | undefined;

    if (file && existAboutMe.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: existAboutMe.photo,
        currentFile: file,
      });
    }

    if (file && !existAboutMe.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    updateAboutMeDto.photo = photo as string;
    Object.assign(existAboutMe, updateAboutMeDto);

    return await this.aboutMeRepository.save(existAboutMe);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('ID is required for deletion.');
    }

    try {
      // Try to find the record
      const aboutMe = await this.findOne(id);
      if (!aboutMe) {
        throw new NotFoundException('About Me not found');
      }

      if (aboutMe.photo) {
        const deletedFile = await this.fileUploadsService.deleteFileUploads(
          aboutMe.photo,
        );
        if (!deletedFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // Proceed with removal
      await this.aboutMeRepository.remove(aboutMe);

      return {
        message: `About Me  has been successfully removed.`,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
