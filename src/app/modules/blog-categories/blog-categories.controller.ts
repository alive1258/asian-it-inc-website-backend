import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetBlogCategoryDto } from './dto/get-blog-category.dto';

@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  // ✅ Create new blogCategory (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a new blogCategory' })
  @ApiResponse({
    status: 200,
    description: 'blogCategory created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  create(
    @Req() req: Request,
    @Body() createBlogCategoryDto: CreateBlogCategoryDto,
  ) {
    return this.blogCategoriesService.create(req, createBlogCategoryDto);
  }

  // ✅ Get all blogCategorys (Public)
  @Get()
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    example: 'Manager',
    description: 'Search keyword',
  })
  @ApiOperation({ summary: 'Get all blogCategorys with pagination & search' })
  @ApiResponse({
    status: 200,
    description: 'blogCategorys retrieved successfully.',
  })
  findAll(@Query() getBlogCategoryDto: GetBlogCategoryDto) {
    return this.blogCategoriesService.findAll(getBlogCategoryDto);
  }

  // ✅ Get single blogCategory by ID (Public)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'blogCategory ID',
  })
  @ApiOperation({ summary: 'Get a blogCategory by ID' })
  @ApiResponse({
    status: 200,
    description: 'blogCategory retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'blogCategory not found.' })
  findOne(@Param('id') id: string) {
    return this.blogCategoriesService.findOne(id);
  }

  // ✅ Update blogCategory by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60 } })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'blogCategory ID to update',
  })
  @ApiOperation({ summary: 'Update a blogCategory by ID' })
  @ApiResponse({
    status: 200,
    description: 'blogCategory updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or ID format.' })
  @ApiResponse({ status: 404, description: 'blogCategory not found.' })
  update(
    @Param('id') id: string,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ) {
    return this.blogCategoriesService.update(id, updateBlogCategoryDto);
  }

  // ✅ Delete blogCategory by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60 } })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'blogCategory ID to delete',
  })
  @ApiOperation({ summary: 'Delete a blogCategory by ID' })
  @ApiResponse({
    status: 200,
    description: 'blogCategory deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'blogCategory not found.' })
  remove(@Param('id') id: string) {
    return this.blogCategoriesService.remove(id);
  }
}
