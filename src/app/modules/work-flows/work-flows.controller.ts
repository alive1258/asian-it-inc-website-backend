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
import { WorkFlowsService } from './work-flows.service';
import { CreateWorkFlowDto } from './dto/create-work-flow.dto';
import { UpdateWorkFlowDto } from './dto/update-work-flow.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetWorkFlowDto } from './dto/get-work-flow.dto';

@Controller('work-flows')
export class WorkFlowsController {
  constructor(private readonly workFlowsService: WorkFlowsService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FileInterceptor('photo')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new service Faq Introduction.' })
  @ApiResponse({
    status: 201,
    description: 'service Faq Introduction created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 409,
    description: 'service Faq Introduction already exists.',
  })
  create(
    @Req() req: Request,
    @Body() createWorkFlowDto: CreateWorkFlowDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workFlowsService.create(req, createWorkFlowDto, file);
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
  findAll(@Query() getWorkFlowDto: GetWorkFlowDto) {
    return this.workFlowsService.findAll(getWorkFlowDto);
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
    return this.workFlowsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Service Faq Introduction by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Service Faq Introduction ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Service Faq Introduction updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() updateWorkFlowDto: UpdateWorkFlowDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workFlowsService.update(id, updateWorkFlowDto, file);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
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
    return this.workFlowsService.remove(id);
  }
}
