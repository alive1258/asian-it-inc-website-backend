import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetTeamMemberDto } from './dto/get-team-member.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { TeamMemberSkillsService } from '../team-member-skills/team-member-skills.service';
import { TeamMemberSkill } from '../team-member-skills/entities/team-member-skill.entity';
import { TeamMemberSocialLink } from '../team-member-social-links/entities/team-member-social-link.entity';
// import { TeamMemberWithSkillsDto } from './dto/team-member-with-skills.dto';
import { TeamMemberSocialLinksService } from './../team-member-social-links/team-member-social-links.service';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    private readonly teamMemberSkillsService: TeamMemberSkillsService,
    private readonly teamMemberSocialLinksService: TeamMemberSocialLinksService,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    @Req() req: Request,
    createTeamMemberDto: CreateTeamMemberDto,
    file?: Express.Multer.File,
  ): Promise<TeamMember> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a teamMember with the same name already exists
    const existTeamMember = await this.teamMemberRepository.findOne({
      where: { name: createTeamMemberDto.name },
    });

    // ⚠️ Prevent duplicate entries
    if (existTeamMember) {
      throw new UnauthorizedException('Team Member already exist');
    }

    let photo: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded photo path (single or from array)
      photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new teamMember entity with user and optional photo
    const teamMember = this.teamMemberRepository.create({
      ...createTeamMemberDto,
      added_by: user_id,
      photo,
      designation_id: createTeamMemberDto.designation_id,
    });

    // 💾 Persist the entity to the database
    return await this.teamMemberRepository.save(teamMember);
  }

  public async findAll(
    getTeamMemberDto: GetTeamMemberDto,
  ): Promise<IPagination<TeamMember>> {
    const searchableFields = ['name'];
    const select = [
      'id',
      'name',
      'slug',
      'photo',
      'designation_id',
      'added_by',
      'created_at',
      'updated_at',
    ];
    const relations = ['designation'];
    const selectRelations = [
      'designation.id',
      'designation.name',
      'designation.status',
    ];
    // ✅ Join specified relations

    // Destructure pagination, search, and filters from DTO
    const { limit, page, search, ...filters } = getTeamMemberDto;

    const teamMember = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      select,
      selectRelations,
      repository: this.teamMemberRepository,
    });

    if (!teamMember) {
      throw new NotFoundException('No team member data found');
    }

    return teamMember;
  }

  public async findOne(id: string): Promise<{
    teamMember: TeamMember;
    teamMemberSkills: TeamMemberSkill[];
    teamMemberSocialLinks: TeamMemberSocialLink[];
  }> {
    // public async findOne(id: string): Promise<TeamMemberWithSkillsDto> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
      relations: ['designation'],
      select: {
        designation: {
          name: true,
          status: true,
        },
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Team Member not found');
    }
    const teamMemberSkill = await this.teamMemberSkillsService.findAll({
      member_id: id,
      limit: 100,
    });
    const teamMemberSocialLink =
      await this.teamMemberSocialLinksService.findAll({
        member_id: id,
        limit: 100,
      });

    return {
      teamMember,
      teamMemberSkills: teamMemberSkill?.data,
      teamMemberSocialLinks: teamMemberSocialLink?.data,
    };
  }

  public async update(
    id: string,
    updateTeamMemberDto: UpdateTeamMemberDto,
    file?: Express.Multer.File,
  ): Promise<TeamMember> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Team Member ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const teamMember = await this.teamMemberRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!teamMember) {
      throw new NotFoundException('teamMember not found');
    }

    let photo: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && teamMember.photo) {
      photo = await this.fileUploadsService.updateFileUploads({
        oldFile: teamMember.photo,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !teamMember.photo) {
      photo = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateTeamMemberDto.photo = photo as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(teamMember, updateTeamMemberDto);

    // 💾 Save the updated entity back to the database
    return await this.teamMemberRepository.save(teamMember);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const teamMember = await this.teamMemberRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!teamMember) {
        throw new NotFoundException('Team Member not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (teamMember.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          teamMember.photo,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the teamMember record from the database
      await this.teamMemberRepository.delete(teamMember);

      // 🏁 Return success message
      return {
        message: 'teamMember deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
