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

import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { PricingPlansService } from './pricing-plans.service';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { GetPricingPlanDto } from './dto/get-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

@Controller('price-plans')
export class PricingPlansController {
  constructor(private readonly pricingPlansService: PricingPlansService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @Post()
  @ApiOperation({ summary: 'Create a new team member SocialLinksassociation.' })
  @ApiResponse({
    status: 201,
    description: 'Team member SocialLinks created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 409, description: 'Conflict. Entry already exists.' })
  create(
    @Body() @Req() req: Request,
    createPricingPlanDto: CreatePricingPlanDto,
  ) {
    return this.pricingPlansService.create(req, createPricingPlanDto);
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
  findAll(@Query() getPricingPlanDto: GetPricingPlanDto) {
    return this.pricingPlansService.findAll(getPricingPlanDto);
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
    return this.pricingPlansService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
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
    @Body() updatePricingPlanDto: UpdatePricingPlanDto,
  ) {
    return this.pricingPlansService.update(id, updatePricingPlanDto);
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
    return this.pricingPlansService.remove(id);
  }
}
