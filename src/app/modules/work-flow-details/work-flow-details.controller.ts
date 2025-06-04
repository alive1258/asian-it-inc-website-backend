import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkFlowDetailsService } from './work-flow-details.service';
import { CreateWorkFlowDetailDto } from './dto/create-work-flow-detail.dto';
import { UpdateWorkFlowDetailDto } from './dto/update-work-flow-detail.dto';

@Controller('work-flow-details')
export class WorkFlowDetailsController {
  constructor(private readonly workFlowDetailsService: WorkFlowDetailsService) {}

  @Post()
  create(@Body() createWorkFlowDetailDto: CreateWorkFlowDetailDto) {
    return this.workFlowDetailsService.create(createWorkFlowDetailDto);
  }

  @Get()
  findAll() {
    return this.workFlowDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workFlowDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkFlowDetailDto: UpdateWorkFlowDetailDto) {
    return this.workFlowDetailsService.update(+id, updateWorkFlowDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workFlowDetailsService.remove(+id);
  }
}
