import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FaqAnsService } from './faq-ans.service';
import { CreateFaqAnDto } from './dto/create-faq-an.dto';
import { UpdateFaqAnDto } from './dto/update-faq-an.dto';

@Controller('faq-ans')
export class FaqAnsController {
  constructor(private readonly faqAnsService: FaqAnsService) {}

  @Post()
  create(@Body() createFaqAnDto: CreateFaqAnDto) {
    return this.faqAnsService.create(createFaqAnDto);
  }

  @Get()
  findAll() {
    return this.faqAnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqAnsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqAnDto: UpdateFaqAnDto) {
    return this.faqAnsService.update(+id, updateFaqAnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqAnsService.remove(+id);
  }
}
