import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateHomeAboutSectionDto } from './dto/create-home-about-section.dto';
import { UpdateHomeAboutSectionDto } from './dto/update-home-about-section.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeAboutSection } from './entities/home-about-section.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { GetHomeAboutSectionDto } from './dto/get-home-about-section.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class HomeAboutSectionService {
  constructor(
    @InjectRepository(HomeAboutSection)
    private readonly homeAboutSectionRepository: Repository<HomeAboutSection>,
    private readonly dataQueryService: DataQueryService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}
  public async create(
    req: Request,
    createHomeAboutSectionDto: CreateHomeAboutSectionDto,
    file?: Express.Multer.File,
  ): Promise<HomeAboutSection> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException(
        'User ID is required.You have to sing in!',
      );
    }

    const existHomeAboutSection = await this.homeAboutSectionRepository.findOne(
      {
        where: { description: createHomeAboutSectionDto.description },
      },
    );

    if (existHomeAboutSection) {
      throw new BadRequestException('Home About Section already exists!');
    }

    // Handle file upload if file is present
    let thumbnail_image: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      thumbnail_image = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    //crete new HomeHeroSection

    let newHomeAboutSection = this.homeAboutSectionRepository.create({
      ...createHomeAboutSectionDto,
      added_by: user_id,
      thumbnail_image,
    });

    const result =
      await this.homeAboutSectionRepository.save(newHomeAboutSection);
    return result;
  }

  public async findAll(
    getHomeAboutSectionDto: GetHomeAboutSectionDto,
  ): Promise<IPagination<HomeAboutSection>> {
    const searchableFields = ['description'];

    const { page, limit, search, ...filters } = getHomeAboutSectionDto;

    const homeAboutSections = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.homeAboutSectionRepository,
    });

    return homeAboutSections;
  }

  public async findOne(id: string): Promise<HomeAboutSection> {
    const homeAboutSection = await this.homeAboutSectionRepository.findOne({
      where: { id },
    });
    if (!homeAboutSection) {
      throw new NotFoundException('Home About Section not found');
    }
    return homeAboutSection;
  }

  public async update(
    id: string,
    updateHomeAboutSectionDto: UpdateHomeAboutSectionDto,
    file?: Express.Multer.File,
  ): Promise<HomeAboutSection> {
    // Validate ID presence
    if (!id) {
      throw new BadRequestException('HomeAboutSection ID is required.');
    }

    // Find the existing record
    const existHomeAboutSection =
      await this.homeAboutSectionRepository.findOneBy({ id });

    if (!existHomeAboutSection) {
      throw new NotFoundException(
        'HomeAboutSection not found with the given ID.',
      );
    }

    // Handle photo update (if file is uploaded)
    let thumbnail_image: string | string[] | undefined;

    if (file && existHomeAboutSection.thumbnail_image) {
      // Replace old photo with new one
      thumbnail_image = await this.fileUploadsService.updateFileUploads({
        oldFile: existHomeAboutSection.thumbnail_image,
        currentFile: file,
      });
    }

    // Upload new photo if no previous one
    if (file && !existHomeAboutSection.thumbnail_image) {
      thumbnail_image = await this.fileUploadsService.fileUploads(file);
    }

    // Assign new photo if uploaded
    updateHomeAboutSectionDto.thumbnail_image = thumbnail_image as string;
    // Merge updated fields into existing entity
    Object.assign(existHomeAboutSection, updateHomeAboutSectionDto);

    // Save and return the updated record
    return await this.homeAboutSectionRepository.save(existHomeAboutSection);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('ID is required for deletion.');
    }

    try {
      // Try to find the record
      const homeAboutSection = await this.findOne(id);

      if (!homeAboutSection) {
        throw new NotFoundException(`Home About Section not found with ID`);
      }

      // Delete associated photo if it exists
      if (homeAboutSection.thumbnail_image) {
        const deletedFile = await this.fileUploadsService.deleteFileUploads(
          homeAboutSection.thumbnail_image,
        );
        if (!deletedFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // Proceed with removal
      await this.homeAboutSectionRepository.remove(homeAboutSection);

      return {
        message: `Home About Section with ID  has been successfully removed.`,
      };
    } catch (error) {
      // Log it or handle known DB/File errors differently if needed
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
