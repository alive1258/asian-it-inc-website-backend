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
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { GetDesignationDto } from './dto/get-designation.dto';

// ✅ Groups endpoints in Swagger UI
@Controller('designations')
@ApiTags('Designations')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  // ✅ Create new designation (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a new Designation' })
  @ApiResponse({
    status: 200,
    description: 'Designation created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  create(
    @Req() req: Request,
    @Body() createDesignationDto: CreateDesignationDto,
  ) {
    return this.designationsService.create(req, createDesignationDto);
  }

  // ✅ Get all designations (Public)
  @Get()
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    example: 'Manager',
    description: 'Search keyword',
  })
  @ApiOperation({ summary: 'Get all Designations with pagination & search' })
  @ApiResponse({
    status: 200,
    description: 'Designations retrieved successfully.',
  })
  findAll(@Query() getDesignationDto: GetDesignationDto) {
    return this.designationsService.findAll(getDesignationDto);
  }

  // ✅ Get single designation by ID (Public)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Designation ID',
  })
  @ApiOperation({ summary: 'Get a Designation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Designation retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  findOne(@Param('id') id: string) {
    return this.designationsService.findOne(id);
  }

  // ✅ Update designation by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60 } })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Designation ID to update',
  })
  @ApiOperation({ summary: 'Update a Designation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Designation updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or ID format.' })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  update(
    @Param('id') id: string,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    return this.designationsService.update(id, updateDesignationDto);
  }

  // ✅ Delete designation by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60 } })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Designation ID to delete',
  })
  @ApiOperation({ summary: 'Delete a Designation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Designation deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  remove(@Param('id') id: string) {
    return this.designationsService.remove(id);
  }
}
