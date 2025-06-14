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
import { WorkFlowToolsService } from './work-flow-tools.service';
import { CreateWorkFlowToolDto } from './dto/create-work-flow-tool.dto';
import { UpdateWorkFlowToolDto } from './dto/update-work-flow-tool.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetWorkFlowToolDto } from './dto/get-work-flow-tools.dto';

@Controller('work-flow-tools')
export class WorkFlowToolsController {
  constructor(private readonly workFlowToolsService: WorkFlowToolsService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
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
    @Body() createWorkFlowToolDto: CreateWorkFlowToolDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workFlowToolsService.create(req, createWorkFlowToolDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all WorkFlowTool data with pagination and search.',
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
  findAll(@Query() getWorkFlowToolDto: GetWorkFlowToolDto) {
    return this.workFlowToolsService.findAll(getWorkFlowToolDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single WorkFlowTool by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Unique identifier of the WorkFlowTool',
    example: 'f61b1f0e-1234-4d65-b12c-a1a23c21f456',
  })
  @ApiResponse({ status: 200, description: 'Data fetched successfully.' })
  @ApiResponse({ status: 404, description: 'Data not found.' })
  findOne(@Param('id') id: string) {
    return this.workFlowToolsService.findOne(id);
  }
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
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
    @Body() updateWorkFlowToolDto: UpdateWorkFlowToolDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workFlowToolsService.update(id, updateWorkFlowToolDto, file);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a WorkFlowDetail  by ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the WorkFlowDetail  to delete.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'WorkFlowDetail  deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'WorkFlowDetail  not found.' })
  remove(@Param('id') id: string) {
    return this.workFlowToolsService.remove(id);
  }
}
