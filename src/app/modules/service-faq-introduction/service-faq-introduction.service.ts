import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceFaqIntroductionDto } from './dto/create-service-faq-introduction.dto';
import { UpdateServiceFaqIntroductionDto } from './dto/update-service-faq-introduction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceFaqIntroduction } from './entities/service-faq-introduction.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetServiceFaqIntroductionDto } from './dto/get-service-faq-introduction.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ServiceFaqIntroductionService {
  constructor(
    @InjectRepository(ServiceFaqIntroduction)
    private readonly serviceFaqIntroductionRepository: Repository<ServiceFaqIntroduction>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createServiceFaqIntroductionDto: CreateServiceFaqIntroductionDto,
    file?: Express.Multer.File,
  ): Promise<ServiceFaqIntroduction> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a existBlogTitle with the same name already exists
    const existServiceFaqIntroduction =
      await this.serviceFaqIntroductionRepository.findOne({
        where: { headline: createServiceFaqIntroductionDto.headline },
      });

    // ⚠️ Prevent duplicate entries
    if (existServiceFaqIntroduction) {
      throw new UnauthorizedException('service Faq Introduction already exist');
    }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new existBlogTitle entity with user and optional photo
    const serviceFaqIntroduction = this.serviceFaqIntroductionRepository.create(
      {
        ...createServiceFaqIntroductionDto,
        added_by: user_id,
        photo,
        service_id: createServiceFaqIntroductionDto.service_id,
      },
    );

    // 💾 Persist the entity to the database
    return await this.serviceFaqIntroductionRepository.save(
      serviceFaqIntroduction,
    );
  }

  public async findAll(
    getServiceFaqIntroductionDto: GetServiceFaqIntroductionDto,
  ): Promise<IPagination<ServiceFaqIntroduction>> {
    // Define which fields are searchable
    const searchableFields = ['headline', 'description'];

    // Define related entities to join (eager loading)
    const relations = ['service'];
    const selectRelations = ['service.name'];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getServiceFaqIntroductionDto;

    // Query the database using the dataQueryService
    const serviceFaqIntroduction = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.serviceFaqIntroductionRepository,
    });

    // Handle case when no blogs are found
    if (!serviceFaqIntroduction) {
      throw new NotFoundException('No Service Faq Introduction data found');
    }

    return serviceFaqIntroduction;
  }

  public async findOne(id: string): Promise<ServiceFaqIntroduction> {
    const serviceFaqIntroduction =
      await this.serviceFaqIntroductionRepository.findOne({
        where: {
          id,
        },
        relations: ['service'],
        select: {
          service: {
            name: true,
          },
        },
      });
    if (!serviceFaqIntroduction) {
      throw new BadRequestException('No service Faq Introduction  data found');
    }
    return serviceFaqIntroduction;
  }

  public async update(
    id: string,
    updateServiceFaqIntroductionDto: UpdateServiceFaqIntroductionDto,
    file?: Express.Multer.File,
  ): Promise<ServiceFaqIntroduction> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Team Member ID is required');
    }

    // 🔍 Find existing serviceFaqIntroduction by ID
    const serviceFaqIntroduction =
      await this.serviceFaqIntroductionRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!serviceFaqIntroduction) {
      throw new NotFoundException('serviceFaqIntroduction not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && serviceFaqIntroduction.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: serviceFaqIntroduction.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !serviceFaqIntroduction.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateServiceFaqIntroductionDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(serviceFaqIntroduction, updateServiceFaqIntroductionDto);

    // 💾 Save the updated entity back to the database
    return await this.serviceFaqIntroductionRepository.save(
      serviceFaqIntroduction,
    );
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const serviceFaqIntroduction =
        await this.serviceFaqIntroductionRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!serviceFaqIntroduction) {
        throw new NotFoundException('serviceFaqIntroduction not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (serviceFaqIntroduction.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          serviceFaqIntroduction.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the serviceFaqIntroduction record from the database
      await this.serviceFaqIntroductionRepository.delete(
        serviceFaqIntroduction,
      );

      // 🏁 Return success message
      return {
        message: 'serviceFaqIntroduction deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
