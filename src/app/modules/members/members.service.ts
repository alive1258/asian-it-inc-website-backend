import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetMemberDto } from './dto/get-members.dto';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,

    private readonly dataQueryService: DataQueryService,
  ) {}
  public async create(
    req: Request,
    createMemberDto: CreateMemberDto,
  ): Promise<Member> {
    const user_id = req?.user?.sub;
    if (!user_id) {
      throw new BadRequestException('User ID is required.You have to sing in!');
    }
    const existMember = await this.membersRepository.findOne({
      where: { user_id: +user_id, group_id: createMemberDto.group_id },
    });
    if (existMember) {
      throw new BadRequestException('Member already exist.');
    }
    const member = this.membersRepository.create({
      ...createMemberDto,
      added_by: +user_id,
    });
    return await this.membersRepository.save(member);
  }

  public async findAll(
    req: Request,
    getMemberDto: GetMemberDto,
  ): Promise<IPagination<Member>> {
    // define searchableFields
    const searchableFields = ['status', 'group_name'];

    // define relations
    const relations = ['user', 'group'];
    const { page, limit, search, ...filters } = getMemberDto;

    const selectRelations = ['user.name', 'group.name'];

    const members = this.dataQueryService.dataQuery({
      paginationQuery: {
        limit,
        page,
        search,
        filters,
      },
      searchableFields,
      repository: this.membersRepository,
      relations,
      selectRelations,
    });

    return members;
  }

  public async findOne(id: number): Promise<Member> {
    const member = await this.membersRepository.findOne({
      where: { id },
      relations: ['group', 'user'],
      select: {
        id: true,
        group_id: true,
        user_id: true,
        status: true,
        group: {
          name: true,
        },
        user: {
          name: true,
        },
      },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  public async update(
    @Param('id', ParseIntPipe) id: number,
    updateMemberDto: UpdateMemberDto,
  ) {
    // validate id
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }

    // Fetch the existing member
    const member = await this.membersRepository.findOneBy({ id });

    // Check if the member exists
    if (!member) {
      throw new NotFoundException(`Member dose not found`);
    }
    // Update the member properties using Object.assign
    Object.assign(member, updateMemberDto);
    // Save and return the updated member
    return await this.membersRepository.save(member);
  }

  /** Remove a group by ID */
  public async remove(id: number): Promise<{ message: string }> {
    const member = await this.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    await this.membersRepository.remove(member);
    return { message: `Member with ID ${id} has been removed` };
  }
}
