import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateHomeHeroDto } from './dto/create-home-hero.dto';
import { UpdateHomeHeroDto } from './dto/update-home-hero.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { GetHomeHeroDto } from './dto/get-home-hero.dto';
import { HomeHeroService } from './home-hero.service';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('home-hero')
@ApiTags('Home Hero') // ✅ Good practice: Swagger tag for grouping endpoints
export class HomeHeroController {
  constructor(private readonly homeHeroService: HomeHeroService) {}

  // ✅ Protected POST endpoint
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
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
  create(@Req() req: Request, @Body() createHomeHeroDto: CreateHomeHeroDto) {
    return this.homeHeroService.create(req, createHomeHeroDto);
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
  findAll(@Query() getHomeHeroDto: GetHomeHeroDto) {
    return this.homeHeroService.findAll(getHomeHeroDto);
  }

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
    return this.homeHeroService.findOne(id);
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
  update(
    @Param('id') id: string,
    @Body() updateHomeHeroDto: UpdateHomeHeroDto,
  ) {
    return this.homeHeroService.update(id, updateHomeHeroDto);
  }

  // ✅ Protected DELETE endpoint for removing by ID
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
    return this.homeHeroService.remove(id);
  }
}
