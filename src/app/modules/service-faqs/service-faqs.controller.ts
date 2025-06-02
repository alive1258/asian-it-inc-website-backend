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
import { ServiceFaqsService } from './service-faqs.service';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { UpdateServiceFaqDto } from './dto/update-service-faq.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetServiceFaqDto } from './dto/get-service-faq.dto';

@Controller('service-faqs')
export class ServiceFaqsController {
  constructor(private readonly serviceFaqsService: ServiceFaqsService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @Post()
  @ApiOperation({ summary: 'Create a new Why Choose  association.' })
  @ApiResponse({
    status: 201,
    description: 'Why Choose  created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 409, description: 'Conflict. Entry already exists.' })
  create(
    @Body() @Req() req: Request,
    createServiceFaqDto: CreateServiceFaqDto,
  ) {
    return this.serviceFaqsService.create(req, createServiceFaqDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of Why Choose s.' })
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
    description: 'Search term to filter Why Chooses by name or .',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    example: true,
    description: 'Filter by active status.',
  })
  @ApiResponse({ status: 200, description: 'List of Why Choose s.' })
  findAll(@Query() getServiceFaqDto: GetServiceFaqDto) {
    return this.serviceFaqsService.findAll(getServiceFaqDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific Why Choose .' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the Why Choose .',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Why Choose  found.' })
  @ApiResponse({ status: 404, description: 'Why Choose  not found.' })
  findOne(@Param('id') id: string) {
    return this.serviceFaqsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing Why Choose .' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the Why Choose  to update.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Why Choose  updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or bad request.' })
  @ApiResponse({ status: 404, description: 'Why Choose  not found.' })
  update(
    @Param('id') id: string,
    @Body() updateServiceFaqDto: UpdateServiceFaqDto,
  ) {
    return this.serviceFaqsService.update(id, updateServiceFaqDto);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Why Choose  by ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the Why Choose  to delete.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Why Choose  deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Why Choose  not found.' })
  remove(@Param('id') id: string) {
    return this.serviceFaqsService.remove(id);
  }
}
