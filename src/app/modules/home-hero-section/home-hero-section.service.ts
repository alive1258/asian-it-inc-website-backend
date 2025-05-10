import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateHomeHeroSectionDto } from './dto/create-home-hero-section.dto';
import { UpdateHomeHeroSectionDto } from './dto/update-home-hero-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeHeroSection } from './entities/home-hero-section.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { Request } from 'express';
import { GetHomeHeroSectionDto } from './dto/get-home-hero-section.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class HomeHeroSectionService {
  constructor(
    @InjectRepository(HomeHeroSection)

    /**
     * Inject repository
     */
    private readonly homeHeroSectionRepository: Repository<HomeHeroSection>,

    private readonly dataQueryService: DataQueryService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  public async create(
    req: Request,
    createHomeHeroSectionDto: CreateHomeHeroSectionDto,
    file?: Express.Multer.File,
  ): Promise<HomeHeroSection> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException('User ID is required.You have to sing in!');
    }

    const existHomeHeroSection = await this.homeHeroSectionRepository.findOne({
      where: { name: createHomeHeroSectionDto.name },
    });

    if (existHomeHeroSection) {
      throw new BadRequestException('HomeHeroSection already exists!');
    }

    // Handle file upload if file is present
    let photo: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    //crete new HomeHeroSection

    let newHomeHeroSection = this.homeHeroSectionRepository.create({
      ...createHomeHeroSectionDto,
      added_by: user_id,
      photo,
    });
    const result =
      await this.homeHeroSectionRepository.save(newHomeHeroSection);
    return result;
  }

  public async findAll(
    getHomeHeroSectionDto: GetHomeHeroSectionDto,
  ): Promise<IPagination<HomeHeroSection>> {
    const searchableFields = ['name'];

    const { page, limit, search, ...filters } = getHomeHeroSectionDto;

    const homeHeroSections = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.homeHeroSectionRepository,
    });

    return homeHeroSections;
  }

  public async findOne(id: string): Promise<HomeHeroSection> {
    const homeHeroSection = await this.homeHeroSectionRepository.findOne({
      where: { id },
    });
    if (!homeHeroSection) {
      throw new BadRequestException('HomeHeroSection not found');
    }
    return homeHeroSection;
  }

  public async update(
    id: string,
    updateHomeHeroSectionDto: UpdateHomeHeroSectionDto,
    file?: Express.Multer.File,
  ): Promise<HomeHeroSection> {
    // Validate ID presence
    if (!id) {
      throw new BadRequestException('Hero section ID is required.');
    }
    // Find the existing record
    const existHomeHeroSection = await this.homeHeroSectionRepository.findOneBy(
      { id },
    );

    if (!existHomeHeroSection) {
      throw new BadRequestException(
        'Home Hero Section not found with the given ID.',
      );
    }

    // Handle photo update (if file is uploaded)
    let photo: string | string[] | undefined;

    if (file && existHomeHeroSection.photo) {
      // Replace old photo with new one
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: existHomeHeroSection.photo,
        currentFile: file,
      });
    }

    // Upload new photo if no previous one
    if (file && !existHomeHeroSection.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // Assign new photo if uploaded
    updateHomeHeroSectionDto.photo = photo as string | undefined;

    // Merge updated fields into existing entity
    Object.assign(existHomeHeroSection, updateHomeHeroSectionDto);

    // Save and return the updated record
    return await this.homeHeroSectionRepository.save(existHomeHeroSection);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('ID is required for deletion.');
    }

    try {
      // Try to find the record
      const homeHeroSection = await this.findOne(id);

      if (!homeHeroSection) {
        throw new NotFoundException(`Home Hero Section not found with ID`);
      }

      // Delete associated photo if it exists
      if (homeHeroSection.photo) {
        const deletedFile = await this.fileUploadsService.deleteFileUploads(
          homeHeroSection.photo,
        );
        if (!deletedFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // Proceed with removal
      await this.homeHeroSectionRepository.remove(homeHeroSection);

      return {
        message: `Home Hero Section with ID  has been successfully removed.`,
      };
    } catch (error) {
      // Log it or handle known DB/File errors differently if needed
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
