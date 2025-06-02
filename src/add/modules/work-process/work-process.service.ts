import { Injectable } from '@nestjs/common';
import { CreateWorkProcessDto } from './dto/create-work-process.dto';
import { UpdateWorkProcessDto } from './dto/update-work-process.dto';

@Injectable()
export class WorkProcessService {
  create(createWorkProcessDto: CreateWorkProcessDto) {
    return 'This action adds a new workProcess';
  }

  findAll() {
    return `This action returns all workProcess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workProcess`;
  }

  update(id: number, updateWorkProcessDto: UpdateWorkProcessDto) {
    return `This action updates a #${id} workProcess`;
  }

  remove(id: number) {
    return `This action removes a #${id} workProcess`;
  }
}
