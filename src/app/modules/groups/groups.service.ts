import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { Repository } from 'typeorm';
import { classToPlain, instanceToPlain } from 'class-transformer';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups)
    private readonly groupRepository: Repository<Groups>,
  ) {}

  /** Create a new group */
  public async create(
    req: any,
    createGroupDto: CreateGroupDto,
  ): Promise<Groups> {
    const id = req.user.sub;
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }

    // Validate check_in_time and check_out_time format
    //  if (!/^\d{2}:\d{2}:\d{2}$/.test(createGroupDto.check_in_time) || !/^\d{2}:\d{2}:\d{2}$/.test(createGroupDto.check_out_time)) {
    //   throw new BadRequestException('check_in_time and check_out_time must be in HH:mm:ss format.');
    // }
    const group = this.groupRepository.create({
      ...createGroupDto,
      added_by: id,
      check_in_time: new Date(createGroupDto.check_in_time),
      check_out_time: new Date(createGroupDto.check_out_time),
    });
    return this.groupRepository.save(group);
  }

  /** Retrieve all groups */

  public async findAll() {
    // Fetch groups with related user
    const groups = await this.groupRepository.find({
      relations: ['group_type'],
      // select: ['id', 'name', 'group_type_id','group_type.name', 'check_in_time', 'check_out_time'],
      select: {
        id: true,
        name: true,
        group_type_id: true,
        check_in_time: true,
        check_out_time: true,
        group_type: {
          name: true,
        },
      },
    });

    return groups;
  }

  /** Retrieve a single group by ID */
  public async findOne(id: number): Promise<Groups> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['group_type'],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  /** Update an existing group */
  public async update(
    @Param('id', ParseIntPipe) id: number,
    updateGroupDto: UpdateGroupDto,
  ) {
    // validate id
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }
    // Fetch the existing attendance
    const group = await this.findOne(id);

    // Check if the attendance exists
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    // Update the attendance properties using Object.assign
    Object.assign(group, updateGroupDto);

    // Save and return the updated attendance
    return await this.groupRepository.save(group);
  }

  /** Remove a group by ID */
  public async remove(id: number): Promise<{ message: string }> {
    const group = await this.findOne(id); // Ensures entity exists
    if (!group) {
      throw new NotFoundException(`group with ID ${id} not found`);
    }
    await this.groupRepository.remove(group); // Triggers hooks
    return { message: 'Group deleted successfully' };
  }
}
