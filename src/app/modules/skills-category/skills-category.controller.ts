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
import { SkillsCategoryService } from './skills-category.service';
import { CreateSkillsCategoryDto } from './dto/create-skills-category.dto';
import { UpdateSkillsCategoryDto } from './dto/update-skills-category.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetSkillsCategoryDto } from './dto/get-skills-category.dto';

@Controller('skills-category')
export class SkillsCategoryController {
  constructor(private readonly skillsCategoryService: SkillsCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new snapshots category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  create(
    @Req() req: Request,
    @Body() createSkillsCategoryDto: CreateSkillsCategoryDto,
  ) {
    return this.skillsCategoryService.create(req, createSkillsCategoryDto);
  }

  @Get('/all-skills-category')
  @ApiOperation({ summary: 'Retrieve paginated list of snapshot categories' })
  @ApiResponse({ status: 200, description: 'List retrieved successfully' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number to retrieve',
    example: 1,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search keyword',
    example: 'First',
  })
  findAll(@Query() getSkillsCategoryDto: GetSkillsCategoryDto) {
    return this.skillsCategoryService.findAll(getSkillsCategoryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single snapshots category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the snapshots category',
    example: '64b1c2e5c2f94f0ad9a45d12',
  })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.skillsCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a snapshots category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the snapshots category',
    example: '64b1c2e5c2f94f0ad9a45d12',
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update data or ID' })
  update(
    @Param('id') id: string,
    @Body() updateSkillsCategoryDto: UpdateSkillsCategoryDto,
  ) {
    return this.skillsCategoryService.update(id, updateSkillsCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a snapshots category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the snapshots category to delete',
    example: '64b1c2e5c2f94f0ad9a45d12',
  })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string) {
    return this.skillsCategoryService.remove(id);
  }
}
