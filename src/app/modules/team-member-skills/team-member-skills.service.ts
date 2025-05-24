import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTeamMemberSkillDto } from './dto/create-team-member-skill.dto';
import { UpdateTeamMemberSkillDto } from './dto/update-team-member-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMemberSkill } from './entities/team-member-skill.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetTeamMemberSkillDto } from './dto/get-team-member-skill.dto';

@Injectable()
export class TeamMemberSkillsService {
  constructor(
    @InjectRepository(TeamMemberSkill)
    private readonly teamMemberSkillRepository: Repository<TeamMemberSkill>,
    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createTeamMemberSkillDto: CreateTeamMemberSkillDto,
  ): Promise<TeamMemberSkill> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.teamMemberSkillRepository.create({
      ...createTeamMemberSkillDto,
      member_id: createTeamMemberSkillDto.member_id,
      skill_id: createTeamMemberSkillDto.skill_id,
      added_by: user_id,
    });
    return this.teamMemberSkillRepository.save(newEntry);
  }

  public async findAll(
    getTeamMemberSkillDto: GetTeamMemberSkillDto,
  ): Promise<IPagination<TeamMemberSkill>> {
    // Fields that can be searched by keyword
    const searchableFields = [''];
    const relations = ['skill'];
    const selectRelations = ['skill.name'];
    const select = ['id', 'member_id', 'skill_id', 'created_at'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getTeamMemberSkillDto;

    // Query database using DataQueryService abstraction
    const skill = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      select,
      selectRelations,
      repository: this.teamMemberSkillRepository,
    });
    // check if collaborate is empty
    if (!skill) {
      throw new BadRequestException('No skills  data found');
    }
    return skill;
  }

  public async findOne(id: string): Promise<TeamMemberSkill> {
    const teamMemberSkill = await this.teamMemberSkillRepository.findOne({
      where: { id },
      relations: {
        skill: true,
      },
    });

    if (!teamMemberSkill) {
      throw new NotFoundException('Team Member Skill not found');
    }

    return teamMemberSkill;
  }

  public async update(
    id: string,
    updateTeamMemberSkillDto: UpdateTeamMemberSkillDto,
  ): Promise<TeamMemberSkill> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('skill Id is required');
    }

    // 2. Find the existing skill entity by ID
    const skill = await this.teamMemberSkillRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!skill) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(skill, updateTeamMemberSkillDto);

    // 5. Save and return the updated entity
    return this.teamMemberSkillRepository.save(skill);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('skill ID is required');
    }
    const teamMemberSkill = await this.findOne(id);

    await this.teamMemberSkillRepository.remove(teamMemberSkill);

    return { message: 'teamMemberSkill deleted successfully' };
  }
}
