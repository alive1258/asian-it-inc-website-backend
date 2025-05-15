import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import { UpdateSnapshotDto } from './dto/update-snapshot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Snapshot } from './entities/snapshot.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { Request } from 'express';
import { GetSnapshotDto } from './dto/get-snapshot.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class SnapshotsService {
  constructor(
    @InjectRepository(Snapshot)
    private readonly snapshotRepository: Repository<Snapshot>,
    private readonly dataQueryService: DataQueryService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  public async create(
    req: Request,
    createSnapshotDto: CreateSnapshotDto,
    file?: Express.Multer.File,
  ): Promise<Snapshot> {
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
    const snapshot = this.snapshotRepository.create({
      ...createSnapshotDto,
      added_by: user_id,
      photo,
      snapshots_category_id: createSnapshotDto.snapshots_category_id,
    });
    // save
    const savedSnapshot = await this.snapshotRepository.save(snapshot);
    // return
    return savedSnapshot;
  }

  public async findAll(
    getSnapshotDto: GetSnapshotDto,
  ): Promise<IPagination<Snapshot>> {
    const searchableFields = [''];
    // define relations
    const relations = ['snapshotsCategory'];
    const { page, limit, search, ...filters } = getSnapshotDto;
    const selectRelations = ['snapshotsCategory.photo', 'snapshotsCategory.id'];

    // define query
    const snapshot = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.snapshotRepository,
      relations,
      selectRelations,
    });
    return snapshot;
  }

  public async findOne(id: string): Promise<Snapshot> {
    const snapshot = await this.snapshotRepository.findOne({
      where: { id },
      relations: ['snapshotsCategory'],
    });
    if (!snapshot) {
      throw new BadRequestException('snapshot not found');
    }
    return snapshot;
  }

  public async update(
    id: string,
    updateSnapshotDto: UpdateSnapshotDto,
    file?: Express.Multer.File,
  ): Promise<Snapshot> {
    // validate id
    if (!id) {
      throw new BadRequestException('faq ID is required.');
    }

    // Fetch the existing snapshot

    const snapshot = await this.snapshotRepository.findOneBy({ id });

    // Check if the Snapshot exists
    if (!snapshot) {
      throw new NotFoundException(`Snapshot dose not found`);
    }

    let photo: string | string[] | undefined;
    if (file && snapshot.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: snapshot.photo,
        currentFile: file,
      });
    }

    if (file && !snapshot.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }
    updateSnapshotDto.photo = photo as string | undefined;
    Object.assign(snapshot, updateSnapshotDto);

    // Save and return the updated Snapshot
    return await this.snapshotRepository.save(snapshot);
  }
  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('snapshot ID is required for deletion.');
    }

    try {
      // Try to find the record
      const snapshot = await this.findOne(id);

      if (!snapshot) {
        throw new NotFoundException(`snapshot not found with ID`);
      }

      // Delete associated photo if it exists
      if (snapshot.photo) {
        const deletedFile = await this.fileUploadsService.deleteFileUploads(
          snapshot.photo,
        );
        if (!deletedFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // Proceed with removal
      await this.snapshotRepository.remove(snapshot);

      return {
        message: `snapshot with ID  has been successfully removed.`,
      };
    } catch (error) {
      // Log it or handle known DB/File errors differently if needed
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
