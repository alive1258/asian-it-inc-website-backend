import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollaboratingService } from './collaborating.service';
import { CreateCollaboratingDto } from './dto/create-collaborating.dto';
import { UpdateCollaboratingDto } from './dto/update-collaborating.dto';

@Controller('collaborating')
export class CollaboratingController {
  constructor(private readonly collaboratingService: CollaboratingService) {}

  @Post()
  create(@Body() createCollaboratingDto: CreateCollaboratingDto) {
    return this.collaboratingService.create(createCollaboratingDto);
  }

  @Get()
  findAll() {
    return this.collaboratingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collaboratingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollaboratingDto: UpdateCollaboratingDto) {
    return this.collaboratingService.update(+id, updateCollaboratingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collaboratingService.remove(+id);
  }
}
