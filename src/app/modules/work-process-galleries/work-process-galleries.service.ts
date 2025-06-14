import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkProcessGalleryDto } from './dto/create-work-process-gallery.dto';
import { UpdateWorkProcessGalleryDto } from './dto/update-work-process-gallery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkProcessGallery } from './entities/work-process-gallery.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetWorkProcessGalleryDto } from './dto/get-work-process-gallery.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WorkProcessGalleriesService {
  constructor(
    @InjectRepository(WorkProcessGallery)
    private readonly workProcessGalleryRepository: Repository<WorkProcessGallery>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createWorkProcessGalleryDto: CreateWorkProcessGalleryDto,
    file?: Express.Multer.File,
  ): Promise<WorkProcessGallery> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a existWorkFlowCategory with the same name already exists
    // const existWorkFlowCategory =
    //   await this.workProcessGalleryRepository.findOne({
    //     where: { photo: createWorkProcessGalleryDto.photo },
    //   });

    // // ⚠️ Prevent duplicate entries
    // if (existWorkFlowCategory) {
    //   throw new UnauthorizedException('WorkFlowCategory already exist');
    // }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new existWorkFlowCategory entity with user and optional photo
    const workFlowCategory = this.workProcessGalleryRepository.create({
      ...createWorkProcessGalleryDto,
      added_by: user_id,
      photo,
      portfolio_id: createWorkProcessGalleryDto.portfolio_id,
    });

    // 💾 Persist the entity to the database
    return await this.workProcessGalleryRepository.save(workFlowCategory);
  }
  public async findAll(
    getWorkProcessGalleryDto: GetWorkProcessGalleryDto,
  ): Promise<IPagination<WorkProcessGallery>> {
    // Define which fields are searchable
    const searchableFields = [''];

    // Define related entities to join (eager loading)
    const relations = ['portfolio'];
    const selectRelations = ['portfolio.name'];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getWorkProcessGalleryDto;

    // Query the database using the dataQueryService
    const workProcessGallery = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.workProcessGalleryRepository,
    });

    // Handle case when no blogs are found
    if (!workProcessGallery) {
      throw new NotFoundException('No WorkProcessGallery data found');
    }

    return workProcessGallery;
  }
  public async findOne(id: string): Promise<WorkProcessGallery> {
    const workProcessGallery = await this.workProcessGalleryRepository.findOne({
      where: {
        id,
      },
      relations: ['portfolio'],
    });
    if (!workProcessGallery) {
      throw new BadRequestException('No workProcessGallery  data found');
    }
    return workProcessGallery;
  }

  public async update(
    id: string,
    updateWorkProcessGalleryDto: UpdateWorkProcessGalleryDto,
    file?: Express.Multer.File,
  ): Promise<WorkProcessGallery> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('WorkProcessGallery ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const workProcessGallery =
      await this.workProcessGalleryRepository.findOneBy({
        id,
      });
    // 🛑 Throw error if no matching record is found
    if (!workProcessGallery) {
      throw new NotFoundException('workProcessGallery not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && workProcessGallery.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: workProcessGallery.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !workProcessGallery.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateWorkProcessGalleryDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(workProcessGallery, updateWorkProcessGalleryDto);

    // 💾 Save the updated entity back to the database
    return await this.workProcessGalleryRepository.save(workProcessGallery);
  }
  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const workProcessGallery =
        await this.workProcessGalleryRepository.findOneBy({
          id,
        });

      // 🛑 Throw error if no matching record is found
      if (!workProcessGallery) {
        throw new NotFoundException('Blog not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (workProcessGallery.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          workProcessGallery.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the workProcessGallery record from the database
      await this.workProcessGalleryRepository.delete(workProcessGallery);

      // 🏁 Return success message
      return {
        message: 'workProcessGallery deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
