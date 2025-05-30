import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { CreateWhyChooseDto } from './dtos/why-choose-us.dto';
import { WhyChooseUsService } from './why-choose-us.service';
import { UpdateWhyChooseDto } from './dtos/update-why-choose.dto';
import { request } from 'express';

@Controller('why-choose-us')
export class WhyChooseUsController {

  constructor(private readonly whyChooseService: WhyChooseUsService) { }

  @Post()
  create(@Req() request, @Body() dto: CreateWhyChooseDto) {
    return this.whyChooseService.create(request, dto);
  }

  @Get()
  findAll() {
    return this.whyChooseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.whyChooseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWhyChooseDto,
  ) {
    return this.whyChooseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.whyChooseService.remove(id);
  }
}
