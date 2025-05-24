import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository, In } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetSkillsDto } from './dto/get-skills.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class SkillsService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record

    // Assuming name is always a
    const existingData = await this.skillRepository.findOne({
      where: {
        name: createSkillDto.name,
      },
    });

    // Check if the name already exists in the database
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.skillRepository.create({
      ...createSkillDto,
      added_by: user_id,
    });
    return this.skillRepository.save(newEntry);
  }

  public async findAll(
    getSkillsDto: GetSkillsDto,
  ): Promise<IPagination<Skill>> {
    // Fields that can be searched by keyword
    const searchableFields = ['name'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getSkillsDto;

    // Query database using DataQueryService abstraction
    const skill = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.skillRepository,
    });
    // check if collaborate is empty
    if (!skill) {
      throw new BadRequestException('No skills  data found');
    }
    return skill;
  }

  // ✅ Public GET endpoint to retrieve a single skill entry by ID
  public async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: {
        id,
      },
    });
    if (!skill) {
      throw new BadRequestException('No skill  data found');
    }
    return skill;
  }

  // ✅ Public PATCH endpoint to update a skill entry by ID
  public async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('skill Id is required');
    }

    // 2. Find the existing skill entity by ID
    const skill = await this.skillRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!skill) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(skill, updateSkillDto);

    // 5. Save and return the updated entity
    return this.skillRepository.save(skill);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('skill ID is required');
    }
    const skill = await this.findOne(id);

    await this.skillRepository.remove(skill);

    return { message: 'skill deleted successfully' };
  }
}
