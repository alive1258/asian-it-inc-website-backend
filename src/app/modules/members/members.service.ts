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

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}
  public async create(
    req: any,
    createMemberDto: CreateMemberDto,
  ): Promise<Member> {
    const id = req.user.sub;
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }
    const member = this.membersRepository.create({
      ...createMemberDto,
      added_by: id,
    });
    return await this.membersRepository.save(member);
  }

  public async findAll() {
    // Fetch groups with related user
    const groups = await this.membersRepository.find({
      relations: ['user', 'group', 'added_user'],
    });

    return groups;
  }

  public async findOne(id: number): Promise<Member> {
    const member = await this.membersRepository.findOne({ where: { id } });
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
    const member = await this.findOne(id);
    // Check if the member exists
    if (!member) {
      throw new NotFoundException(`Group with ID ${id} not found`);
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
