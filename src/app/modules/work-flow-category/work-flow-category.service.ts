import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkFlowCategoryDto } from './dto/create-work-flow-category.dto';
import { UpdateWorkFlowCategoryDto } from './dto/update-work-flow-category.dto';
import { WorkFlowCategory } from './entities/work-flow-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetBlogCategoryDto } from './../blog-categories/dto/get-blog-category.dto';
import { GetWorkFlowCategoryDto } from './dto/get-work-flow-category.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WorkFlowCategoryService {
  constructor(
    @InjectRepository(WorkFlowCategory)
    private readonly workFlowCategoryRepository: Repository<WorkFlowCategory>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createWorkFlowCategoryDto: CreateWorkFlowCategoryDto,
    file?: Express.Multer.File,
  ): Promise<WorkFlowCategory> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a existWorkFlowCategory with the same name already exists
    const existWorkFlowCategory = await this.workFlowCategoryRepository.findOne(
      {
        where: { name: createWorkFlowCategoryDto.name },
      },
    );

    // ⚠️ Prevent duplicate entries
    if (existWorkFlowCategory) {
      throw new UnauthorizedException('WorkFlowCategory already exist');
    }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new existWorkFlowCategory entity with user and optional photo
    const workFlowCategory = this.workFlowCategoryRepository.create({
      ...createWorkFlowCategoryDto,
      added_by: user_id,
      photo,
      portfolio_id: createWorkFlowCategoryDto.portfolio_id,
    });

    // 💾 Persist the entity to the database
    return await this.workFlowCategoryRepository.save(workFlowCategory);
  }

  public async findAll(
    getWorkFlowCategoryDto: GetWorkFlowCategoryDto,
  ): Promise<IPagination<WorkFlowCategory>> {
    // Define which fields are searchable
    const searchableFields = ['name'];

    // Define related entities to join (eager loading)
    const relations = ['portfolio'];
    const selectRelations = ['portfolio.name'];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getWorkFlowCategoryDto;

    // Query the database using the dataQueryService
    const workFlowCategory = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.workFlowCategoryRepository,
    });

    // Handle case when no blogs are found
    if (!workFlowCategory) {
      throw new NotFoundException('No WorkFlowCategory data found');
    }

    return workFlowCategory;
  }

  public async findOne(id: string): Promise<WorkFlowCategory> {
    const workFlowCategory = await this.workFlowCategoryRepository.findOne({
      where: {
        id,
      },
      relations: ['portfolio'],
    });
    if (!workFlowCategory) {
      throw new BadRequestException('No workFlowCategory  data found');
    }
    return workFlowCategory;
  }
  public async update(
    id: string,
    updateWorkFlowCategoryDto: UpdateWorkFlowCategoryDto,
    file?: Express.Multer.File,
  ): Promise<WorkFlowCategory> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('WorkFlowCategory ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const workFlowCategory = await this.workFlowCategoryRepository.findOneBy({
      id,
    });
    // 🛑 Throw error if no matching record is found
    if (!workFlowCategory) {
      throw new NotFoundException('workFlowCategory not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && workFlowCategory.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: workFlowCategory.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !workFlowCategory.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateWorkFlowCategoryDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(workFlowCategory, updateWorkFlowCategoryDto);

    // 💾 Save the updated entity back to the database
    return await this.workFlowCategoryRepository.save(workFlowCategory);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const workFlowCategory = await this.workFlowCategoryRepository.findOneBy({
        id,
      });

      // 🛑 Throw error if no matching record is found
      if (!workFlowCategory) {
        throw new NotFoundException('Blog not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (workFlowCategory.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          workFlowCategory.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the workFlowCategory record from the database
      await this.workFlowCategoryRepository.delete(workFlowCategory);

      // 🏁 Return success message
      return {
        message: 'workFlowCategory deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
