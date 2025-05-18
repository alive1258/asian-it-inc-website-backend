import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetSkillDto } from './dto/get-skill.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException(
        'User ID is required.You have to sing in!',
      );
    }
    // create
    const skills = this.skillsRepository.create({
      ...createSkillDto,
      added_by: user_id,
      skills_category_id: createSkillDto.skills_category_id,
    });
    // save
    const savedSkills = await this.skillsRepository.save(skills);
    // return
    return savedSkills;
  }

  public async findAll(getSkillDto: GetSkillDto): Promise<IPagination<Skill>> {
    const searchableFields = [''];
    // define relations
    const relations = ['skillsCategory'];
    const { page, limit, search, ...filters } = getSkillDto;
    const selectRelations = ['skillsCategory.id'];

    // define query
    const snapshot = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.skillsRepository,
      relations,
      selectRelations,
    });
    return snapshot;
  }

  public async findOne(id: string): Promise<Skill> {
    const skills = await this.skillsRepository.findOne({
      where: { id },
      relations: ['skillsCategory'],
    });
    if (!skills) {
      throw new BadRequestException('skills not found');
    }
    return skills;
  }
  public async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    // validate id
    if (!id) {
      throw new BadRequestException('skills ID is required.');
    }

    // Fetch the existing skills

    const skills = await this.skillsRepository.findOneBy({ id });

    // Check if the skills exists
    if (!skills) {
      throw new NotFoundException(`skills dose not found`);
    }
    Object.assign(skills, updateSkillDto);

    // Save and return the updated skills
    return await this.skillsRepository.save(skills);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Skills  ID is required');
    }

    const skills = await this.findOne(id);

    await this.skillsRepository.remove(skills);

    return { message: 'Skills deleted successfully' };
  }
}
