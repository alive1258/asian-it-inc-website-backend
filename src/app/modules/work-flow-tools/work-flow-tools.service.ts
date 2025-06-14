import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkFlowToolDto } from './dto/create-work-flow-tool.dto';
import { UpdateWorkFlowToolDto } from './dto/update-work-flow-tool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkFlowTool } from './entities/work-flow-tool.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetWorkFlowToolDto } from './dto/get-work-flow-tools.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class WorkFlowToolsService {
  constructor(
    @InjectRepository(WorkFlowTool)
    private readonly workFlowToolRepository: Repository<WorkFlowTool>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createWorkFlowToolDto: CreateWorkFlowToolDto,
    file?: Express.Multer.File,
  ) {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a gallery with the same name already exists
    const existWorkFlowTool = await this.workFlowToolRepository.findOne({
      where: { name: createWorkFlowToolDto.name },
    });

    // ⚠️ Prevent duplicate entries
    if (existWorkFlowTool) {
      throw new UnauthorizedException('Work FlowTool already exist');
    }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new WorkFlowTool entity with user and optional photo
    const workFlowTool = this.workFlowToolRepository.create({
      ...createWorkFlowToolDto,
      work_flow_category_id: createWorkFlowToolDto.work_flow_category_id,
      portfolio_id: createWorkFlowToolDto.portfolio_id,
      added_by: user_id,
      photo,
    });

    // 💾 Persist the entity to the database
    return await this.workFlowToolRepository.save(workFlowTool);
  }

  public async findAll(
    getWorkFlowToolDto: GetWorkFlowToolDto,
  ): Promise<IPagination<WorkFlowTool>> {
    // Fields that can be searched by keyword
    const searchableFields = ['name'];
    const relations = ['workFlowCategory', 'portfolio'];
    // const selectRelations = ['service.name'];
    // const select = ['id', 'member_id', 'skill_id', 'created_at'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getWorkFlowToolDto;

    // Query database using DataQueryService abstraction
    const workFlowFlowTool = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      // selectRelations,
      repository: this.workFlowToolRepository,
    });
    // check if collaborate is empty
    if (!workFlowFlowTool) {
      throw new BadRequestException('No WorkFlowFlowTool  data found');
    }
    return workFlowFlowTool;
  }

  public async findOne(id: string): Promise<WorkFlowTool> {
    const workFlowDetailTool = await this.workFlowToolRepository.findOne({
      where: { id },
      relations: {
        workFlowCategory: true,
        portfolio: true,
      },
    });

    if (!workFlowDetailTool) {
      throw new NotFoundException('WorkFlowDetailTool data not found');
    }
    return workFlowDetailTool;
  }

  public async update(
    id: string,
    updateWorkFlowToolDto: UpdateWorkFlowToolDto,
    file?: Express.Multer.File,
  ): Promise<WorkFlowTool> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('  ID is required');
    }

    // 🔍 Find existing WorkGallery by ID
    const workFlowTool = await this.workFlowToolRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!workFlowTool) {
      throw new NotFoundException('workFlowTool not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && workFlowTool.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: workFlowTool.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !workFlowTool.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateWorkFlowToolDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(workFlowTool, updateWorkFlowToolDto);

    // 💾 Save the updated entity back to the database
    return await this.workFlowToolRepository.save(workFlowTool);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing WorkGallery by ID
      const workFlowTool = await this.findOne(id);

      // 🛑 Throw error if no matching record is found
      if (!workFlowTool) {
        throw new NotFoundException('workFlowTool not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (workFlowTool.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          workFlowTool.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the WorkGallery record from the database
      await this.workFlowToolRepository.delete(workFlowTool);

      // 🏁 Return success message
      return {
        message: 'workFlowTool deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
