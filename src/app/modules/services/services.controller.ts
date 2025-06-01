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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetServiceDto } from './dto/get-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FileInterceptor('photo')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new team member.' })
  @ApiResponse({
    status: 201,
    description: 'Team member created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Team member already exists.' })
  create(
    @Req() req: Request,
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.servicesService.create(req, createServiceDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all team members with filters and pagination.',
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
  findAll(@Query() getServiceDto: GetServiceDto) {
    return this.servicesService.findAll(getServiceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single team member by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Team member ID.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Team member found.' })
  @ApiResponse({ status: 404, description: 'Team member not found.' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @UseInterceptors(FileInterceptor('photo'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a team member by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Team member ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.servicesService.update(id, updateServiceDto, file);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team member by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Team member ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Team member not found.' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
