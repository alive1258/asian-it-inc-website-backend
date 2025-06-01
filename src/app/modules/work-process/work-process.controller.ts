import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkProcessService } from './work-process.service';
import { CreateWorkProcessDto } from './dto/create-work-process.dto';
import { UpdateWorkProcessDto } from './dto/update-work-process.dto';

@Controller('work-process')
export class WorkProcessController {
  constructor(private readonly workProcessService: WorkProcessService) {}

  @Post()
  create(@Body() createWorkProcessDto: CreateWorkProcessDto) {
    return this.workProcessService.create(createWorkProcessDto);
  }

  @Get()
  findAll() {
    return this.workProcessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workProcessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkProcessDto: UpdateWorkProcessDto) {
    return this.workProcessService.update(+id, updateWorkProcessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workProcessService.remove(+id);
  }
}
