import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTechnologiesWeUsedDto } from './dto/create-technologies-we-used.dto';
import { UpdateTechnologiesWeUsedDto } from './dto/update-technologies-we-used.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnologiesWeUsed } from './entities/technologies-we-used.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetTechnologiesWeUsedDto } from './dto/get-technologies-we-used.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class TechnologiesWeUsedService {
  constructor(
    @InjectRepository(TechnologiesWeUsed)
    private readonly technologiesWeUsedRepository: Repository<TechnologiesWeUsed>,

    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createTechnologiesWeUsedDto: CreateTechnologiesWeUsedDto,
    file?: Express.Multer.File,
  ): Promise<TechnologiesWeUsed> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a technologiesWeUsed with the same name already exists
    const existTechnologiesWeUsed =
      await this.technologiesWeUsedRepository.findOne({
        where: { technology_name: createTechnologiesWeUsedDto.technology_name },
      });

    // ⚠️ Prevent duplicate entries
    if (existTechnologiesWeUsed) {
      throw new UnauthorizedException('Team Member already exist');
    }

    let icon: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded icon path (single or from array)
      icon = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new technologiesWeUsed entity with user and optional icon
    const technologiesWeUsed = this.technologiesWeUsedRepository.create({
      ...createTechnologiesWeUsedDto,
      added_by: user_id,
      icon,
      service_id: createTechnologiesWeUsedDto.service_id,
      technology_id: createTechnologiesWeUsedDto.technology_id,
    });

    // 💾 Persist the entity to the database
    return await this.technologiesWeUsedRepository.save(technologiesWeUsed);
  }

  public async findAll(
    getTechnologiesWeUsedDto: GetTechnologiesWeUsedDto,
  ): Promise<IPagination<TechnologiesWeUsed>> {
    const searchableFields = ['technology_name'];
    // const select = [
    //   'id',
    //   'name',
    //   'slug',
    //   'photo',
    //   'designation_id',
    //   'added_by',
    //   'created_at',
    //   'updated_at',
    // ];
    const relations = ['service', 'technology'];
    const selectRelations = ['service.name', 'technology.name'];
    // ✅ Join specified relations

    // Destructure pagination, search, and filters from DTO
    const { limit, page, search, ...filters } = getTechnologiesWeUsedDto;

    const technologiesWeUsed = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.technologiesWeUsedRepository,
    });

    if (!technologiesWeUsed) {
      throw new NotFoundException('No technologiesWeUsed data found');
    }

    return technologiesWeUsed;
  }

  public async findOne(id: string): Promise<TechnologiesWeUsed> {
    const technologiesWeUsed = await this.technologiesWeUsedRepository.findOne({
      where: { id },
      relations: ['service', 'technology'],
      select: {
        service: {
          name: true,
        },
        technology: {
          name: true,
        },
      },
    });

    if (!technologiesWeUsed) {
      throw new NotFoundException('Technologies We Used not found');
    }

    return technologiesWeUsed;
  }

  public async update(
    id: string,
    updateTechnologiesWeUsedDto: UpdateTechnologiesWeUsedDto,
    file?: Express.Multer.File,
  ): Promise<TechnologiesWeUsed> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('TechnologiesWeUsed ID is required');
    }

    // 🔍 Find existing technologiesWeUsed by ID
    const technologiesWeUsed =
      await this.technologiesWeUsedRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!technologiesWeUsed) {
      throw new NotFoundException('technologiesWeUsed not found');
    }

    let icon: string | string[] | undefined;

    // 📤 If new file provided and icon exists, update the file storageHandle file upload if a new file is provided
    if (file && technologiesWeUsed.icon) {
      icon = await this.fileUploadsService.updateFileUploads({
        oldFile: technologiesWeUsed.icon,
        currentFile: file,
      });
    }

    // 📤 If new file provided and icon does not exist, upload the new file
    if (file && !technologiesWeUsed.icon) {
      icon = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing icon
    updateTechnologiesWeUsedDto.icon = icon as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(technologiesWeUsed, updateTechnologiesWeUsedDto);

    // 💾 Save the updated entity back to the database
    return await this.technologiesWeUsedRepository.save(technologiesWeUsed);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing technologiesWeUsed by ID
      const technologiesWeUsed =
        await this.technologiesWeUsedRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!technologiesWeUsed) {
        throw new NotFoundException('technologiesWeUsed not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (technologiesWeUsed.icon) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          technologiesWeUsed.icon,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the technologiesWeUsed record from the database
      await this.technologiesWeUsedRepository.delete(technologiesWeUsed);

      // 🏁 Return success message
      return {
        message: 'technologiesWeUsed deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
