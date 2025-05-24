import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTeamMemberSocialLinkDto } from './dto/create-team-member-social-link.dto';
import { UpdateTeamMemberSocialLinkDto } from './dto/update-team-member-social-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMemberSocialLink } from './entities/team-member-social-link.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetTeamMemberSocialLinkDto } from './dto/get-team-member-social-link.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class TeamMemberSocialLinksService {
  constructor(
    @InjectRepository(TeamMemberSocialLink)
    private readonly teamMemberSocialLinkRepository: Repository<TeamMemberSocialLink>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createTeamMemberSocialLinkDto: CreateTeamMemberSocialLinkDto,
  ): Promise<TeamMemberSocialLink> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.teamMemberSocialLinkRepository.create({
      ...createTeamMemberSocialLinkDto,
      member_id: createTeamMemberSocialLinkDto.member_id,
      social_site_id: createTeamMemberSocialLinkDto.social_site_id,
      added_by: user_id,
    });
    return this.teamMemberSocialLinkRepository.save(newEntry);
  }

  public async findAll(
    getTeamMemberSocialLinkDto: GetTeamMemberSocialLinkDto,
  ): Promise<IPagination<TeamMemberSocialLink>> {
    // Fields that can be searched by keyword
    const searchableFields = [''];
    const relations = ['socialSite'];
    const select = ['id', 'member_id', 'social_site_id', 'url', 'created_at'];
    const selectRelations = ['socialSite.name'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getTeamMemberSocialLinkDto;

    // Query database using DataQueryService abstraction
    const SocialLinks = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      select,
      selectRelations,

      repository: this.teamMemberSocialLinkRepository,
    });
    // check if collaborate is empty
    if (!SocialLinks) {
      throw new BadRequestException('No SocialLinks  data found');
    }
    return SocialLinks;
  }

  public async findOne(id: string): Promise<TeamMemberSocialLink> {
    const teamMemberSocialLinks =
      await this.teamMemberSocialLinkRepository.findOne({
        where: { id },
      });

    if (!teamMemberSocialLinks) {
      throw new NotFoundException('Team Member SocialLinks not found');
    }

    return teamMemberSocialLinks;
  }

  public async update(
    id: string,
    updateTeamMemberSocialLinkDto: UpdateTeamMemberSocialLinkDto,
  ): Promise<TeamMemberSocialLink> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('SocialLinks Id is required');
    }

    // 2. Find the existing SocialLinks entity by ID
    const SocialLinks = await this.teamMemberSocialLinkRepository.findOneBy({
      id,
    });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!SocialLinks) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(SocialLinks, updateTeamMemberSocialLinkDto);

    // 5. Save and return the updated entity
    return this.teamMemberSocialLinkRepository.save(SocialLinks);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('SocialLinks ID is required');
    }
    const teamMemberSocialLinks = await this.findOne(id);

    await this.teamMemberSocialLinkRepository.remove(teamMemberSocialLinks);

    return { message: 'teamMemberSocialLinks deleted successfully' };
  }
}
