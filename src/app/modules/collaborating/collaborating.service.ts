import { Injectable } from '@nestjs/common';
import { CreateCollaboratingDto } from './dto/create-collaborating.dto';
import { UpdateCollaboratingDto } from './dto/update-collaborating.dto';

@Injectable()
export class CollaboratingService {
  create(createCollaboratingDto: CreateCollaboratingDto) {
    return 'This action adds a new collaborating';
  }

  findAll() {
    return `This action returns all collaborating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collaborating`;
  }

  update(id: number, updateCollaboratingDto: UpdateCollaboratingDto) {
    return `This action updates a #${id} collaborating`;
  }

  remove(id: number) {
    return `This action removes a #${id} collaborating`;
  }
}
