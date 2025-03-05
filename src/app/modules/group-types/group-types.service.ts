import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateGroupTypeDto } from './dto/create-group-type.dto';
import { UpdateGroupTypeDto } from './dto/update-group-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupType } from './entities/group-type.entity';

@Injectable()
export class GroupTypesService {
  constructor(
    @InjectRepository(GroupType)
    private readonly groupTypeRepository: Repository<GroupType>,
  ) {}
  public async create(
    createGroupTypeDto: CreateGroupTypeDto,
  ): Promise<GroupType> {
    const groupType = this.groupTypeRepository.create(createGroupTypeDto);
    return await this.groupTypeRepository.save(groupType);
  }

  public async findAll(): Promise<GroupType[]> {
    return await this.groupTypeRepository.find();
  }

  public async findOne(id: number): Promise<GroupType> {
    const groupType = await this.groupTypeRepository.findOne({ where: { id } });
    if (!groupType) {
      throw new NotFoundException('GroupType not found');
    }
    return groupType;
  }

  public async update(
    @Param('id', ParseIntPipe) id: number,
    updateGroupTypeDto: UpdateGroupTypeDto,
  ) {
    // validate id
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }
    // Fetch the existing attendance
    const groupType = await this.findOne(id);
    // Check if the attendance exists
    if (!groupType) {
      throw new NotFoundException(`GroupType with ID ${id} not found`);
    }
    // Update the attendance properties using Object.assign
    Object.assign(groupType, updateGroupTypeDto);

    // Save and return the updated attendance
    return this.groupTypeRepository.save(groupType);
  }

  public async remove(id: number): Promise<{ message: string }> {
    const groupType = await this.findOne(id); // Ensures entity exists
    if (!groupType) {
      throw new NotFoundException(`GroupType with ID ${id} not found`);
    }
    await this.groupTypeRepository.remove(groupType); // Triggers hooks
    return { message: 'Group Type deleted successfully' };
  }
}
