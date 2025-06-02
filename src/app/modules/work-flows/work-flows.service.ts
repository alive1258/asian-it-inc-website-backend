import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkFlowDto } from './dto/create-work-flow.dto';
import { UpdateWorkFlowDto } from './dto/update-work-flow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkFlow } from './entities/work-flow.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetWorkFlowDto } from './dto/get-work-flow.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WorkFlowsService {
  constructor(
    @InjectRepository(WorkFlow)
    private readonly workFlowRepository: Repository<WorkFlow>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createWorkFlowDto: CreateWorkFlowDto,
    file?: Express.Multer.File,
  ): Promise<WorkFlow> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a existBlogTitle with the same name already exists
    const existWorkFlow = await this.workFlowRepository.findOne({
      where: { headline: createWorkFlowDto.headline },
    });

    // ⚠️ Prevent duplicate entries
    if (existWorkFlow) {
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
    const workFlow = this.workFlowRepository.create({
      ...createWorkFlowDto,
      added_by: user_id,
      photo,
      service_id: createWorkFlowDto.service_id,
    });

    // 💾 Persist the entity to the database
    return await this.workFlowRepository.save(workFlow);
  }

  public async findAll(
    getWorkFlowDto: GetWorkFlowDto,
  ): Promise<IPagination<WorkFlow>> {
    // Define which fields are searchable
    const searchableFields = ['headline', 'description'];

    // Define related entities to join (eager loading)
    const relations = ['service'];
    const selectRelations = ['service.name'];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getWorkFlowDto;

    // Query the database using the dataQueryService
    const workFlow = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.workFlowRepository,
    });

    // Handle case when no blogs are found
    if (!workFlow) {
      throw new NotFoundException('No work Flow data found');
    }

    return workFlow;
  }

  public async findOne(id: string): Promise<WorkFlow> {
    const workFlow = await this.workFlowRepository.findOne({
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
    if (!workFlow) {
      throw new BadRequestException('No work Flow  data found');
    }
    return workFlow;
  }

  public async update(
    id: string,
    updateWorkFlowDto: UpdateWorkFlowDto,
    file?: Express.Multer.File,
  ): Promise<WorkFlow> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Team Member ID is required');
    }

    // 🔍 Find existing serviceFaqIntroduction by ID
    const workFlow = await this.workFlowRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!workFlow) {
      throw new NotFoundException('workFlow not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && workFlow.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: workFlow.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !workFlow.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateWorkFlowDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(workFlow, updateWorkFlowDto);

    // 💾 Save the updated entity back to the database
    return await this.workFlowRepository.save(workFlow);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const workFlow = await this.workFlowRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!workFlow) {
        throw new NotFoundException('workFlow not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (workFlow.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          workFlow.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the workFlow record from the database
      await this.workFlowRepository.delete(workFlow);

      // 🏁 Return success message
      return {
        message: 'workFlow deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
