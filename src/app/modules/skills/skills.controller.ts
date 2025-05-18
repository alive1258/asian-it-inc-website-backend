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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetSkillDto } from './dto/get-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Data created successfully.',
  })
  create(@Req() req: Request, @Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(req, createSkillDto);
  }

  @Get('/all-skills')
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
  findAll(@Query() getSkillDto: GetSkillDto) {
    return this.skillsService.findAll(getSkillDto);
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
    return this.skillsService.findOne(id);
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
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete Member',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single Member data.',
  })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
