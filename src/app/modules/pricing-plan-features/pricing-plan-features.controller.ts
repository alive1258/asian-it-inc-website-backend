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
import { PricingPlanFeaturesService } from './pricing-plan-features.service';
import { CreatePricingPlanFeatureDto } from './dto/create-pricing-plan-feature.dto';
import { UpdatePricingPlanFeatureDto } from './dto/update-pricing-plan-feature.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetPricingPlanFeaturesDto } from './dto/get-pricing-plan-feature.dto';

@Controller('pricing-plan-features')
export class PricingPlanFeaturesController {
  constructor(
    private readonly pricingPlanFeatureService: PricingPlanFeaturesService,
  ) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @Post()
  @ApiOperation({
    summary: 'Create a new pricingPlanFeature SocialLinksassociation.',
  })
  @ApiResponse({
    status: 201,
    description: 'pricingPlanFeature SocialLinks created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 409, description: 'Conflict. Entry already exists.' })
  create(
    @Body() @Req() req: Request,
    createPricingPlanFeatureDto: CreatePricingPlanFeatureDto,
  ) {
    return this.pricingPlanFeatureService.create(
      req,
      createPricingPlanFeatureDto,
    );
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
  findAll(@Query() getPricingPlanFeaturesDto: GetPricingPlanFeaturesDto) {
    return this.pricingPlanFeatureService.findAll(getPricingPlanFeaturesDto);
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
    return this.pricingPlanFeatureService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a pricingPlanFeature by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'pricingPlanFeature ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'pricingPlanFeature updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() UpdatePricingPlanFeatureDto: UpdatePricingPlanFeatureDto,
  ) {
    return this.pricingPlanFeatureService.update(
      id,
      UpdatePricingPlanFeatureDto,
    );
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
    return this.pricingPlanFeatureService.remove(id);
  }
}
