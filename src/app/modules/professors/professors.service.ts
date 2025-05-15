import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetProfessorDto } from './dto/get-professor.dto';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    @Req() req: Request,
    createProfessorDto: CreateProfessorDto,
    file?: Express.Multer.File,
  ): Promise<Professor> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    const existAboutMe = await this.professorRepository.findOne({
      where: { title: createProfessorDto.title },
    });

    if (existAboutMe) {
      throw new BadRequestException('professor Me already exists');
    }

    let photo: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    //create new AboutMe

    let professor = this.professorRepository.create({
      ...createProfessorDto,
      added_by: user_id,
      photo,
    });

    const result = await this.professorRepository.save(professor);
    return result;
  }

  public async findAll(
    getProfessorDto: GetProfessorDto,
  ): Promise<IPagination<Professor>> {
    const searchableFields = ['title'];

    const { page, limit, search, ...filters } = getProfessorDto;

    const professor = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.professorRepository,
    });

    return professor;
  }

  public async findOne(id: string): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id },
    });
    if (!professor) {
      throw new NotFoundException('professor not found');
    }
    return professor;
  }

  public async update(
    id: string,
    updateProfessorDto: UpdateProfessorDto,
    file?: Express.Multer.File,
  ): Promise<Professor> {
    if (!id) {
      throw new BadRequestException('professor Me ID is required');
    }

    const professor = await this.professorRepository.findOneBy({ id });
    if (!professor) {
      throw new NotFoundException('professor Me not found');
    }

    let photo: string | string[] | undefined;

    if (file && professor.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: professor.photo,
        currentFile: file,
      });
    }

    if (file && !professor.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    updateProfessorDto.photo = photo as string;
    Object.assign(professor, updateProfessorDto);

    return await this.professorRepository.save(professor);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('ID is required for deletion.');
    }

    try {
      // Try to find the record
      const professor = await this.findOne(id);
      if (!professor) {
        throw new NotFoundException('About Me not found');
      }

      if (professor.photo) {
        const deletedFile = await this.fileUploadsService.deleteFileUploads(
          professor.photo,
        );
        if (!deletedFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // Proceed with removal
      await this.professorRepository.remove(professor);

      return {
        message: `professor  has been successfully removed.`,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
