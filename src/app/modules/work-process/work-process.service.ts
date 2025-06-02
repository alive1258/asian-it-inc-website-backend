import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkProcessDto } from './dto/create-work-process.dto';
import { UpdateWorkProcessDto } from './dto/update-work-process.dto';
import { WorkProcess } from './entities/work-process.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetWorkProcessDto } from './dto/get-work-process.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WorkProcessService {
  constructor(
    @InjectRepository(WorkProcess)
    private readonly workProcessRepository: Repository<WorkProcess>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createWorkProcessDto: CreateWorkProcessDto,
    file?: Express.Multer.File,
  ) {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a gallery with the same name already exists
    const existWorkGallery = await this.workProcessRepository.findOne({
      where: { title: createWorkProcessDto.title },
    });

    // ⚠️ Prevent duplicate entries
    if (existWorkGallery) {
      throw new UnauthorizedException('Work process already exist');
    }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new WorkGallery entity with user and optional photo
    const workGallery = this.workProcessRepository.create({
      ...createWorkProcessDto,
      added_by: user_id,
      photo,
    });

    // 💾 Persist the entity to the database
    return await this.workProcessRepository.save(workGallery);
  }

  public async findAll(
    getWorkProcessDto: GetWorkProcessDto,
  ): Promise<IPagination<WorkProcess>> {
    // ✅ Define which fields are searchable using the 'search' keyword
    const searchableFields = ['title', 'description'];

    // ✅ Destructure pagination and search-related fields from the DTO
    const { page, limit, search, ...filters } = getWorkProcessDto;

    // ✅ Delegate query logic to the reusable dataQuery service
    const result = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.workProcessRepository,
    });

    // ✅ Return the final paginated result
    return result;
  }

  public async findOne(id: string): Promise<WorkProcess> {
    // Attempt to find the work gallery item by its ID
    const workProcess = await this.workProcessRepository.findOne({
      where: { id },
    });
    if (!workProcess) {
      throw new NotFoundException('WorkProcess not found');
    }
    return workProcess;
  }

  public async update(
    id: string,
    updateWorkProcessDto: UpdateWorkProcessDto,
    file?: Express.Multer.File,
  ): Promise<WorkProcess> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException(' ID is required');
    }

    // 🔍 Find existing workProcess by ID
    const workProcess = await this.workProcessRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!workProcess) {
      throw new NotFoundException('workProcess not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && workProcess.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: workProcess.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !workProcess.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateWorkProcessDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(workProcess, updateWorkProcessDto);

    // 💾 Save the updated entity back to the database
    return await this.workProcessRepository.save(workProcess);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing workProcess by ID
      const workProcess = await this.findOne(id);

      // 🛑 Throw error if no matching record is found
      if (!workProcess) {
        throw new NotFoundException('workProcess not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (workProcess.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          workProcess.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the workProcess record from the database
      await this.workProcessRepository.delete(workProcess);

      // 🏁 Return success message
      return {
        message: 'workProcess deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
