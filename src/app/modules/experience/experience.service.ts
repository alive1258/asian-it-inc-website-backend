import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetExperienceDto } from './dto/get-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    private readonly dataQueryService: DataQueryService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  public async create(
    req: Request,
    createExperienceDto: CreateExperienceDto,
    file?: Express.Multer.File,
  ): Promise<Experience> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    const existExperience = await this.experienceRepository.findOne({
      where: {
        institute_name: createExperienceDto.institute_name,
      },
    });

    if (existExperience) {
      throw new BadRequestException('Experience already exists');
    }

    let photo: string | undefined;
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }

    // create new newExperience

    const newExperience = this.experienceRepository.create({
      ...createExperienceDto,
      added_by: user_id,
      photo,
    });

    return await this.experienceRepository.save(newExperience);
  }

  public async findAll(
    getExperienceDto: GetExperienceDto,
  ): Promise<IPagination<Experience>> {
    const searchableFields = ['institute_name'];

    const { page, limit, search, ...filters } = getExperienceDto;
    const experience = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.experienceRepository,
    });

    return experience;
  }

  public async findOne(id: string): Promise<Experience> {
    const experience = await this.experienceRepository.findOne({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }

  public async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
    file?: Express.Multer.File,
  ): Promise<Experience> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    const existingExperience = await this.experienceRepository.findOneBy({
      id,
    });

    if (!existingExperience) {
      throw new NotFoundException('Experience not found');
    }

    let photo: string | string[] | undefined;
    if (file && existingExperience.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: existingExperience.photo,
        currentFile: file,
      });
    }

    updateExperienceDto.photo = photo as string | undefined;

    Object.assign(existingExperience, updateExperienceDto);

    return await this.experienceRepository.save(existingExperience);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    try {
      const experience = await this.findOne(id);

      if (!experience) {
        throw new NotFoundException('Experience not found');
      }

      //delete associated photo if it exists
      if (experience.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          experience.photo,
        );
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete photo');
        }
      }

      //proceed to delete the experience
      await this.experienceRepository.remove(experience);

      return { message: 'Experience deleted successfully' };
    } catch (error) {
      // Log it or handle known DB/File errors differently if needed
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
