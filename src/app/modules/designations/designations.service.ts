import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetDesignationDto } from './dto/get-designation.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class DesignationsService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createDesignationDto: CreateDesignationDto,
  ): Promise<Designation> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record
    const existingData = await this.designationRepository.findOne({
      where: {
        name: createDesignationDto.name,
      },
    });
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.designationRepository.create({
      ...createDesignationDto,
      added_by: user_id,
    });
    return this.designationRepository.save(newEntry);
  }
  public async findAll(
    getDesignationDto: GetDesignationDto,
  ): Promise<IPagination<Designation>> {
    // Fields that can be searched by keyword
    const searchableFields = ['name'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getDesignationDto;

    // Query database using DataQueryService abstraction
    const designation = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.designationRepository,
    });
    // check if collaborate is empty
    if (!designation) {
      throw new BadRequestException('No designation  data found');
    }
    return designation;
  }

  // ✅ Public GET endpoint to retrieve a single designation entry by ID
  public async findOne(id: string): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: {
        id,
      },
    });
    if (!designation) {
      throw new BadRequestException('No Designation  data found');
    }
    return designation;
  }

  // ✅ Public PATCH endpoint to update a designation entry by ID
  public async update(
    id: string,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('designation Id is required');
    }

    // 2. Find the existing designation entity by ID
    const designation = await this.designationRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!designation) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(designation, updateDesignationDto);

    // 5. Save and return the updated entity
    return this.designationRepository.save(designation);
  }
  // ✅ Public DELETE endpoint to remove a designation entry by ID
  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('designation ID is required');
    }
    const designation = await this.findOne(id);

    await this.designationRepository.remove(designation);

    return { message: 'designation deleted successfully' };
  }
}
