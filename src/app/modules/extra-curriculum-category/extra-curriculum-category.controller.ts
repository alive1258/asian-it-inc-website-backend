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
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { ExtraCurriculumCategoryService } from './extra-curriculum-category.service';
import { CreateExtraCurriculumCategoryDto } from './dto/create-extra-curriculum-category.dto';
import { UpdateExtraCurriculumCategoryDto } from './dto/update-extra-curriculum-category.dto';
import { GetExtraCurriculumCategoryDto } from './dto/get-extra-curriculum-category.dto';

@ApiTags('Extra Curriculum Categories')
@Controller('extra-curriculum-categories')
export class ExtraCurriculumCategoryController {
  constructor(
    private readonly extraCurriculumCategoryService: ExtraCurriculumCategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new extra curriculum category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(
    @Req() req: Request,
    @Body() createExtraCurriculumCategoryDto: CreateExtraCurriculumCategoryDto,
  ) {
    return this.extraCurriculumCategoryService.create(
      req,
      createExtraCurriculumCategoryDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all extra curriculum categories with filters and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by title',
    example: 'Faculty of Engineering',
  })
  findAll(
    @Query() getExtraCurriculumCategoryDto: GetExtraCurriculumCategoryDto,
  ) {
    return this.extraCurriculumCategoryService.findAll(
      getExtraCurriculumCategoryDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Category ID',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.extraCurriculumCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Category ID',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update payload or ID' })
  update(
    @Param('id') id: string,
    @Body() updateExtraCurriculumCategoryDto: UpdateExtraCurriculumCategoryDto,
  ) {
    return this.extraCurriculumCategoryService.update(
      id,
      updateExtraCurriculumCategoryDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Category ID',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string) {
    return this.extraCurriculumCategoryService.remove(id);
  }
}
