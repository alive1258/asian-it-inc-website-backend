import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetBlogDto } from './dto/get-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FileInterceptor('thumbnail')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new blog.' })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Blog already exists.' })
  create(
    @Req() req: Request,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogsService.create(req, createBlogDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all blogs with filters and pagination.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '10' })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'John' })
  @ApiQuery({
    name: 'anyFilterField',
    required: false,
    type: String,
    example: 'active',
    description: 'Any custom filter field (e.g., status).',
  })
  findAll(@Query() getBlogDto: GetBlogDto) {
    return this.blogsService.findAll(getBlogDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single blog by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Blog ID.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Blog found.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Blog ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Blog updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogsService.update(id, updateBlogDto, file);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Blog ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Blog deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
