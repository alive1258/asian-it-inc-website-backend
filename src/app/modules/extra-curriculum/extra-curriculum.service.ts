import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExtraCurriculumDto } from './dto/create-extra-curriculum.dto';
import { UpdateExtraCurriculumDto } from './dto/update-extra-curriculum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { ExtraCurriculum } from './entities/extra-curriculum.entity';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetExtraCurriculumCategoryDto } from '../extra-curriculum-category/dto/get-extra-curriculum-category.dto';

@Injectable()
export class ExtraCurriculumService {
  constructor(
    @InjectRepository(ExtraCurriculum)
    private readonly extraCurriculumRepository: Repository<ExtraCurriculum>,
    private readonly dataQueryService: DataQueryService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}
  public async create(
    req: Request,
    createExtraCurriculumDto: CreateExtraCurriculumDto,
    file?: Express.Multer.File,
  ): Promise<ExtraCurriculum> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException(
        'User ID is required.You have to sing in!',
      );
    }

    let photo: string | undefined;
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }

    // create
    const extraCurriculum = this.extraCurriculumRepository.create({
      ...createExtraCurriculumDto,
      added_by: user_id,
      photo,
      extra_curriculum_categories_id:
        createExtraCurriculumDto.extra_curriculum_categories_id,
    });

    return await this.extraCurriculumRepository.save(extraCurriculum);
  }

  public async findAll(
    getExtraCurriculumCategoryDto: GetExtraCurriculumCategoryDto,
  ): Promise<IPagination<ExtraCurriculum>> {
    const searchableFields = ['title'];

    // Define relation names to load
    const relations = ['extraCurriculumCategory'];

    // Destructure pagination and filters
    const { page, limit, search, ...filters } = getExtraCurriculumCategoryDto;
    // Define selective relation fields to optimize performance
    const selectRelations = ['extraCurriculum.id'];

    // Perform the paginated query
    const result = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.extraCurriculumRepository,
      relations,
      selectRelations,
    });
    return result;
  }

  public async findOne(id: string): Promise<ExtraCurriculum> {
    const snapshot = await this.extraCurriculumRepository.findOne({
      where: { id },
      relations: ['extraCurriculumCategory'],
    });
    if (!snapshot) {
      throw new BadRequestException('extraCurriculumCategory not found');
    }
    return snapshot;
  }

  public async update(
    id: string,
    updateExtraCurriculumDto: UpdateExtraCurriculumDto,
    file?: Express.Multer.File,
  ): Promise<ExtraCurriculum> {
    // validate id
    if (!id) {
      throw new BadRequestException('Extra Curriculum ID is required.');
    }

    // Fetch the existing Extra Curriculum

    const extraCurriculum = await this.extraCurriculumRepository.findOneBy({
      id,
    });

    // Check if the Extra Curriculum  exists
    if (!extraCurriculum) {
      throw new NotFoundException(`Extra Curriculum  dose not found`);
    }

    let photo: string | string[] | undefined;
    if (file && extraCurriculum.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: extraCurriculum.photo,
        currentFile: file,
      });
    }

    if (file && !extraCurriculum.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }
    updateExtraCurriculumDto.photo = photo as string | undefined;
    Object.assign(extraCurriculum, updateExtraCurriculumDto);

    // Save and return the updated extraCurriculum
    return await this.extraCurriculumRepository.save(extraCurriculum);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException(
        'Extra Curriculum ID is required for deletion.',
      );
    }

    try {
      // Try to find the record
      const extraCurriculum = await this.findOne(id);

      if (!extraCurriculum) {
        throw new NotFoundException(`Extra Curriculum not found with ID`);
      }

      // Delete associated photo if it exists
      if (extraCurriculum.photo) {
        const deletedFile = await this.fileUploadsService.deleteFileUploads(
          extraCurriculum.photo,
        );
        if (!deletedFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // Proceed with removal
      await this.extraCurriculumRepository.remove(extraCurriculum);

      return {
        message: `Extra Curriculum with ID  has been successfully removed.`,
      };
    } catch (error) {
      // Log it or handle known DB/File errors differently if needed
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
