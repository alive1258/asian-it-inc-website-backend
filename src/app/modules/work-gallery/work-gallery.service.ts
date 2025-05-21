import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkGalleryDto } from './dto/create-work-gallery.dto';
import { UpdateWorkGalleryDto } from './dto/update-work-gallery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkGallery } from './entities/work-gallery.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from './../../common/data-query/data-query.service';
import { Request } from 'express';
import { FileUploadsService } from './../../common/file-uploads/file-uploads.service';
import { GetWorkGalleryDto } from './dto/get-work-gallery.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WorkGalleryService {
  constructor(
    @InjectRepository(WorkGallery)
    private readonly workGalleryRepository: Repository<WorkGallery>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    @Req() req: Request,
    createWorkGalleryDto: CreateWorkGalleryDto,
    file?: Express.Multer.File,
  ) {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a gallery with the same name already exists
    const existWorkGallery = await this.workGalleryRepository.findOne({
      where: { name: createWorkGalleryDto.name },
    });

    // ⚠️ Prevent duplicate entries
    if (existWorkGallery) {
      throw new UnauthorizedException('Work Gallery already exist');
    }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new WorkGallery entity with user and optional photo
    const workGallery = this.workGalleryRepository.create({
      ...createWorkGalleryDto,
      added_by: user_id,
      photo,
    });

    // 💾 Persist the entity to the database
    return await this.workGalleryRepository.save(workGallery);
  }

  public async findAll(
    getWorkGalleryDto: GetWorkGalleryDto,
  ): Promise<IPagination<WorkGallery>> {
    // ✅ Define which fields are searchable using the 'search' keyword
    const searchableFields = ['name'];

    // ✅ Destructure pagination and search-related fields from the DTO
    const { page, limit, search, ...filters } = getWorkGalleryDto;

    // ✅ Delegate query logic to the reusable dataQuery service
    const result = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.workGalleryRepository,
    });

    // ✅ Return the final paginated result
    return result;
  }
  public async findOne(id: string): Promise<WorkGallery> {
    // Attempt to find the work gallery item by its ID
    const workGallery = await this.workGalleryRepository.findOne({
      where: { id },
    });
    if (!workGallery) {
      throw new NotFoundException('workGallery not found');
    }
    return workGallery;
  }

  public async update(
    id: string,
    updateWorkGalleryDto: UpdateWorkGalleryDto,
    file?: Express.Multer.File,
  ): Promise<WorkGallery> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('  ID is required');
    }

    // 🔍 Find existing WorkGallery by ID
    const workGallery = await this.workGalleryRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!workGallery) {
      throw new NotFoundException('workGallery not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && workGallery.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: workGallery.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !workGallery.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateWorkGalleryDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(workGallery, updateWorkGalleryDto);

    // 💾 Save the updated entity back to the database
    return await this.workGalleryRepository.save(workGallery);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing WorkGallery by ID
      const workGallery = await this.findOne(id);

      // 🛑 Throw error if no matching record is found
      if (!workGallery) {
        throw new NotFoundException('workGallery not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (workGallery.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          workGallery.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the WorkGallery record from the database
      await this.workGalleryRepository.delete(workGallery);

      // 🏁 Return success message
      return {
        message: 'workGallery deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
