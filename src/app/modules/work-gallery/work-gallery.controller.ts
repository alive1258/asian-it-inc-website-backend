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
import { WorkGalleryService } from './work-gallery.service';
import { CreateWorkGalleryDto } from './dto/create-work-gallery.dto';
import { UpdateWorkGalleryDto } from './dto/update-work-gallery.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetWorkGalleryDto } from './dto/get-work-gallery.dto';

@Controller('work-gallery')
export class WorkGalleryController {
  constructor(private readonly workGalleryService: WorkGalleryService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FileInterceptor('photo')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new Work Gallery item.' })
  @ApiResponse({
    status: 201,
    description: 'Work Gallery item created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  @ApiResponse({ status: 409, description: 'Duplicate gallery name.' })
  create(
    @Req() req: Request,
    @Body() createWorkGalleryDto: CreateWorkGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workGalleryService.create(req, createWorkGalleryDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all Work Gallery data with pagination and search.',
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    required: false,
    description: 'Number of entries per page.',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    type: String,
    required: false,
    description: 'Page number to retrieve.',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search term to filter by name.',
    example: 'Logo Design',
  })
  @ApiQuery({
    name: 'anyFilterField',
    type: String,
    required: false,
    description: 'Additional filter fields (e.g., status, createdBy, etc.).',
    example: 'active',
  })
  findAll(@Query() getWorkGalleryDto: GetWorkGalleryDto) {
    return this.workGalleryService.findAll(getWorkGalleryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single Work Gallery by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Unique identifier of the Work Gallery',
    example: 'f61b1f0e-1234-4d65-b12c-a1a23c21f456',
  })
  @ApiResponse({ status: 200, description: 'Data fetched successfully.' })
  @ApiResponse({ status: 404, description: 'Data not found.' })
  findOne(@Param('id') id: string) {
    return this.workGalleryService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @UseInterceptors(FileInterceptor('photo'))
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
    @Body() updateWorkGalleryDto: UpdateWorkGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workGalleryService.update(id, updateWorkGalleryDto, file);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
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
    return this.workGalleryService.remove(id);
  }
}
