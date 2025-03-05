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
import { GroupTypesService } from './group-types.service';
import { CreateGroupTypeDto } from './dto/create-group-type.dto';
import { UpdateGroupTypeDto } from './dto/update-group-type.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('group-types')
export class GroupTypesController {
  constructor(private readonly groupTypesService: GroupTypesService) {}

  /**
   * Create Group Type  controller
   */
  @Post()
  @ApiOperation({
    summary: 'Create a Group Type data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Group Type Data created successfully.',
  })
  @Post()
  create(@Body() createGroupTypeDto: CreateGroupTypeDto) {
    return this.groupTypesService.create(createGroupTypeDto);
  }

  /**
   * Get all Group Type controller
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
    summary: 'Get all the Group Type data.',
  })
  findAll() {
    return this.groupTypesService.findAll();
  }

  /**
   * Get single Group Type controller
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single Group Type data',
    example: '1',
  })
  @ApiOperation({
    summary: 'Get single Group Type data.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupTypesService.findOne(id);
  }

  /**
   * Update single Group Type controller
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update Group Type',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single Group Type data.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupTypeDto: UpdateGroupTypeDto,
  ) {
    return this.groupTypesService.update(id, updateGroupTypeDto);
  }

  /**
   * Delete single Group Type  controller
   */
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete Group Type',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single Group Type data.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupTypesService.remove(id);
  }
}
