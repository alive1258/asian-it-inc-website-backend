import { Injectable } from '@nestjs/common';
import { CreateWorkFlowDetailDto } from './dto/create-work-flow-detail.dto';
import { UpdateWorkFlowDetailDto } from './dto/update-work-flow-detail.dto';

@Injectable()
export class WorkFlowDetailsService {
  create(createWorkFlowDetailDto: CreateWorkFlowDetailDto) {
    return 'This action adds a new workFlowDetail';
  }

  findAll() {
    return `This action returns all workFlowDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workFlowDetail`;
  }

  update(id: number, updateWorkFlowDetailDto: UpdateWorkFlowDetailDto) {
    return `This action updates a #${id} workFlowDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} workFlowDetail`;
  }
}
