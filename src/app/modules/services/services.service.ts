import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetServiceDto } from './dto/get-service.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createServiceDto: CreateServiceDto,
    file?: Express.Multer.File,
  ) {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a gallery with the same name already exists
    const existService = await this.serviceRepository.findOne({
      where: { name: createServiceDto.name },
    });

    // ⚠️ Prevent duplicate entries
    if (existService) {
      throw new UnauthorizedException('Service already exist');
    }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new WorkGallery entity with user and optional photo
    const service = this.serviceRepository.create({
      ...createServiceDto,
      added_by: user_id,
      featured_photo: photo,
      service_icon: photo,
    });

    // 💾 Persist the entity to the database
    return await this.serviceRepository.save(service);
  }

  public async findAll(
    getServiceDto: GetServiceDto,
  ): Promise<IPagination<Service>> {
    // ✅ Define which fields are searchable using the 'search' keyword
    const searchableFields = ['name', 'short_description'];

    // ✅ Destructure pagination and search-related fields from the DTO
    const { page, limit, search, ...filters } = getServiceDto;

    // ✅ Delegate query logic to the reusable dataQuery service
    const result = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.serviceRepository,
    });

    // ✅ Return the final paginated result
    return result;
  }
  public async findOne(id: string): Promise<Service> {
    // Attempt to find the work gallery item by its ID
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    return service;
  }
  public async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    let featured_photo: string | string[] | undefined;
    let service_icon: string | string[] | undefined;

    if (file && service.featured_photo) {
      featured_photo = await this.fileUploadsService.updateFileUploads({
        oldFile: service.featured_photo,
        currentFile: file,
      });
    }

    if (file && service.service_icon) {
      service_icon = await this.fileUploadsService.updateFileUploads({
        oldFile: service.service_icon,
        currentFile: file,
      });
    }

    if (file && !service.featured_photo) {
      featured_photo = await this.fileUploadsService.fileUploads(file);
    }

    if (file && !service.service_icon) {
      service_icon = await this.fileUploadsService.fileUploads(file);
    }

    updateServiceDto.featured_photo = featured_photo as string | undefined;
    updateServiceDto.service_icon = service_icon as string | undefined;

    Object.assign(service, updateServiceDto);

    return await this.serviceRepository.save(service);
  }
  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    try {
      const service = await this.findOne(id);

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Delete featured_photo if it exists
      if (service.featured_photo) {
        const deleted = await this.fileUploadsService.deleteFileUploads(
          service.featured_photo,
        );
        if (!deleted) {
          throw new BadRequestException('Failed to delete featured photo');
        }
      }

      // Delete service_icon if it exists
      if (service.service_icon) {
        const deleted = await this.fileUploadsService.deleteFileUploads(
          service.service_icon,
        );
        if (!deleted) {
          throw new BadRequestException('Failed to delete service icon');
        }
      }

      // Delete service by ID
      await this.serviceRepository.delete(id);

      return {
        message: 'Service deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
