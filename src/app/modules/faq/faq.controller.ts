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
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetFaqDto } from './dto/get-faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}
  // ✅ Protected POST endpoint
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  @ApiOperation({
    summary: 'Create a new Home Hero section entry',
    description:
      'This endpoint creates a new Home Hero entry with title and description. Authentication is required.',
  })
  @ApiResponse({
    status: 201,
    description: 'Home Hero entry created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed. Check the input fields.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. Authentication credentials were missing or invalid.',
  })
  create(@Req() req: Request, @Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(req, createFaqDto);
  }

  // ✅ Public GET endpoint with pagination and search support

  @Get()
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of records per page (pagination)',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search keyword for filtering results by title or description',
    example: 'First',
  })
  @ApiOperation({
    summary: 'Retrieve all home hero data with pagination and search support',
  })
  @ApiResponse({
    status: 200,
    description: 'List of home hero entries fetched successfully',
  })
  findAll(@Query() getFaqDto: GetFaqDto) {
    return this.faqService.findAll(getFaqDto);
  }

  // ✅ Public GET endpoint to retrieve by ID
  // ✅ Public GET endpoint to retrieve by ID
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Unique identifier for the home hero entry',
    example: '4',
  })
  @ApiOperation({
    summary: 'Retrieve a single home hero entry by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the entry',
  })
  @ApiResponse({
    status: 404,
    description: 'Entry not found with the given ID',
  })
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  // ✅ Protected PATCH endpoint for updating by ID
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Unique ID of the Hero section to be updated',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update a specific Hero Section entry by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the Hero Section entry',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format or invalid update payload',
  })
  @ApiResponse({
    status: 404,
    description: 'No Hero Section found with the provided ID',
  })
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID of the Hero section entry to delete',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete a Hero Section entry by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the Hero Section entry',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'No Hero Section found with the provided ID',
  })
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
