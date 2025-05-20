import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkGalleryService } from './work-gallery.service';
import { CreateWorkGalleryDto } from './dto/create-work-gallery.dto';
import { UpdateWorkGalleryDto } from './dto/update-work-gallery.dto';

@Controller('work-gallery')
export class WorkGalleryController {
  constructor(private readonly workGalleryService: WorkGalleryService) {}

  @Post()
  create(@Body() createWorkGalleryDto: CreateWorkGalleryDto) {
    return this.workGalleryService.create(createWorkGalleryDto);
  }

  @Get()
  findAll() {
    return this.workGalleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workGalleryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkGalleryDto: UpdateWorkGalleryDto) {
    return this.workGalleryService.update(+id, updateWorkGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workGalleryService.remove(+id);
  }
}
