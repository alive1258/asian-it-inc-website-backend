import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /**
   * Create points  controller
   */
  @Post()
  @ApiOperation({
    summary: 'Create a points  data.',
  })
  @ApiResponse({
    status: 201,
    description: 'points  Data created successfully.',
  })
  create(@Body() createPointDto: CreatePointDto) {
    return this.pointsService.create(createPointDto);
  }

  /**
   * Get all points controller
   */
  @Get()
  @ApiQuery({
    name: 'limit',
    type: 'string',
    required: false,
    description: 'The number of entries returned per query',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    type: 'string',
    required: false,
    description: 'The page that wanted.',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    description: 'Search anything that you want.',
    example: 'First',
  })
  @ApiOperation({
    summary: 'Get all the points data.',
  })
  findAll() {
    return this.pointsService.findAll();
  }

  /**
   * Get single points Type controller
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single points  data',
    example: '1',
  })
  @ApiOperation({
    summary: 'Get single points  data.',
  })
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(+id);
  }

  /**
   * Update single point Type controller
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update point',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single point data.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePointDto: UpdatePointDto,
  ) {
    return this.pointsService.update(id, updatePointDto);
  }

  /**
   * Delete single point controller
   */
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete point',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single point data.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pointsService.remove(id);
  }
}
