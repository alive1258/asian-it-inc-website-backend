import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { BlogDetailsService } from './blog-details.service';
import { CreateBlogDetailDto } from './dto/create-blog-detail.dto';
import { UpdateBlogDetailDto } from './dto/update-blog-detail.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('blog-details')
export class BlogDetailsController {
  constructor(private readonly blogDetailsService: BlogDetailsService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FilesInterceptor('files')) // 📎 Handles file upload with key 'photo'
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
    @Body() createBlogDetailDto: CreateBlogDetailDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.blogDetailsService.create(req, createBlogDetailDto, files);
  }

  @Get()
  findAll() {
    return this.blogDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogDetailsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @UseInterceptors(FilesInterceptor('files'))
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
    @Body() updateBlogDetailDto: UpdateBlogDetailDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.blogDetailsService.update(id, updateBlogDetailDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogDetailsService.remove(+id);
  }
}
