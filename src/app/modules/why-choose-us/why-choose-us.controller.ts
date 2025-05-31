import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateWhyChooseDto } from './dtos/why-choose-us.dto';
import { WhyChooseUsService } from './why-choose-us.service';
import { UpdateWhyChooseDto } from './dtos/update-why-choose.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('why-choose-us')
export class WhyChooseUsController {

  constructor(private readonly whyChooseService: WhyChooseUsService) { }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @ApiOperation({ summary: 'Create a why choose us .' })
  @ApiResponse({
    status: 201,
    description: 'why choose us created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'why choose us already exists.' })
  @Post()
  create(@Req() request: Request, @Body() dto: CreateWhyChooseDto) {
    return this.whyChooseService.create(request, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reasons for choosing us.' })
  @ApiResponse({
    status: 200,
    description: 'List of reasons returned successfully.',
  })
  findAll() {
    return this.whyChooseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific reason by ID.' })
  @ApiResponse({
    status: 200,
    description: 'Single reason returned successfully.',
  })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Reason ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.whyChooseService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific reason by ID.' })
  @ApiResponse({
    status: 200,
    description: 'Reason updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Reason ID' })
  @ApiBody({ type: UpdateWhyChooseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWhyChooseDto,
  ) {
    return this.whyChooseService.update(id, dto);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific reason by ID.' })
  @ApiResponse({
    status: 200,
    description: 'Reason deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Reason ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.whyChooseService.remove(id);
  }
}
