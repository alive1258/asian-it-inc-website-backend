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
import { WorkProcessGalleriesService } from './work-process-galleries.service';
import { CreateWorkProcessGalleryDto } from './dto/create-work-process-gallery.dto';
import { UpdateWorkProcessGalleryDto } from './dto/update-work-process-gallery.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetWorkProcessDto } from '../work-process/dto/get-work-process.dto';
import { GetWorkProcessGalleryDto } from './dto/get-work-process-gallery.dto';

@Controller('work-process-galleries')
export class WorkProcessGalleriesController {
  constructor(
    private readonly workProcessGalleriesService: WorkProcessGalleriesService,
  ) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FileInterceptor('photo')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new workFlowCategory.' })
  @ApiResponse({
    status: 201,
    description: 'workFlowCategory created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'workFlowCategory already exists.' })
  create(
    @Req() req: Request,
    @Body() createWorkProcessGalleryDto: CreateWorkProcessGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workProcessGalleriesService.create(
      req,
      createWorkProcessGalleryDto,
      file,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workFlowCategory with filters and pagination.',
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
  findAll(@Query() getWorkProcessGalleryDto: GetWorkProcessGalleryDto) {
    return this.workProcessGalleriesService.findAll(getWorkProcessGalleryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single workFlowCategory by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'WorkFlowCategory ID.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'WorkFlowCategory found.' })
  @ApiResponse({ status: 404, description: 'WorkFlowCategory not found.' })
  findOne(@Param('id') id: string) {
    return this.workProcessGalleriesService.findOne(id);
  }
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
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
    @Body() updateWorkProcessGalleryDto: UpdateWorkProcessGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workProcessGalleriesService.update(
      id,
      updateWorkProcessGalleryDto,
      file,
    );
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a WorkFlowCategory by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'WorkFlowCategory ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'WorkFlowCategory deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'WorkFlowCategory not found.' })
  remove(@Param('id') id: string) {
    return this.workProcessGalleriesService.remove(id);
  }
}
