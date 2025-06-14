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
import { WorkFlowDetailsService } from './work-flow-details.service';
import { CreateWorkFlowDetailDto } from './dto/create-work-flow-detail.dto';
import { UpdateWorkFlowDetailDto } from './dto/update-work-flow-detail.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetWorkFlowDetailDto } from './dto/get-work-flow-detail.dto';

@Controller('work-flow-details')
export class WorkFlowDetailsController {
  constructor(
    private readonly workFlowDetailsService: WorkFlowDetailsService,
  ) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @Post()
  @ApiOperation({ summary: 'Create a new WorkFlowDetails association.' })
  @ApiResponse({
    status: 201,
    description: 'WorkFlowDetails created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 409, description: 'Conflict. Entry already exists.' })
  create(
    @Req() req: Request,
    @Body() createWorkFlowDetailDto: CreateWorkFlowDetailDto,
  ) {
    return this.workFlowDetailsService.create(req, createWorkFlowDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of WorkFlowDetails s.' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'John',
    description: 'Search term to filter WorkFlowDetails by name or .',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    example: true,
    description: 'Filter by active status.',
  })
  @ApiResponse({ status: 200, description: 'List of WorkFlowDetails s.' })
  findAll(@Query() getWorkFlowDetailDto: GetWorkFlowDetailDto) {
    return this.workFlowDetailsService.findAll(getWorkFlowDetailDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific workFlowDetail .' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the workFlowDetail .',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'workFlowDetail  found.' })
  @ApiResponse({ status: 404, description: 'workFlowDetail  not found.' })
  findOne(@Param('id') id: string) {
    return this.workFlowDetailsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing WorkFlowDetail .' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the WorkFlowDetail  to update.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'WorkFlowDetail  updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or bad request.' })
  @ApiResponse({ status: 404, description: 'WorkFlowDetail  not found.' })
  update(
    @Param('id') id: string,
    @Body() updateWorkFlowDetailDto: UpdateWorkFlowDetailDto,
  ) {
    return this.workFlowDetailsService.update(id, updateWorkFlowDetailDto);
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
    return this.workFlowDetailsService.remove(id);
  }
}
