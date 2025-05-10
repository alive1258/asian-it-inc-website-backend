import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { HomeEducationService } from './home-education.service';
import { CreateHomeEducationDto } from './dto/create-home-education.dto';
import { UpdateHomeEducationDto } from './dto/update-home-education.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetHomeEducationDto } from './dto/get-home-education.dto';

@Controller('home-education')
export class HomeEducationController {
  constructor(private readonly homeEducationService: HomeEducationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Data created successfully.',
  })
  create(
    @Req() req: Request,
    @Body() createHomeEducationDto: CreateHomeEducationDto,
  ) {
    return this.homeEducationService.create(req, createHomeEducationDto);
  }

  @Get('/all-home-education')
  @ApiQuery({
    name: 'limit',
    type: 'string',
    required: false,
    description: 'The number of entries returned per query',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    type: 'string',
    required: false,
    description: 'The page that wanted.',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    description: 'Search anything that you want.',
    example: 'First',
  })
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll(@Query() getHomeEducationDto: GetHomeEducationDto) {
    return this.homeEducationService.findAll(getHomeEducationDto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single data',
    example: '4',
  })
  @ApiOperation({
    summary: 'Get single data.',
  })
  findOne(@Param('id') id: string) {
    return this.homeEducationService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update faq',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single faq data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the Hero Section.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID or update data.' })
  update(
    @Param('id') id: string,
    @Body() updateHomeEducationDto: UpdateHomeEducationDto,
  ) {
    return this.homeEducationService.update(id, updateHomeEducationDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete homeEducationService',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single  data.',
  })
  remove(@Param('id') id: string) {
    return this.homeEducationService.remove(id);
  }
}
