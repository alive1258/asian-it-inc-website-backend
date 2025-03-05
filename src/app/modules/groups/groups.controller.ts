import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  /**
   * Create Groups  controller
   */
  @Post()
  @ApiOperation({
    summary: 'Create a Groups  data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Groups  Data created successfully.',
  })
  create(@Req() req, @Body() createGroupTypeDto: CreateGroupDto) {
    return this.groupsService.create(req, createGroupTypeDto);
  }

  /**
   * Get all Groups controller
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
    summary: 'Get all the Groups data.',
  })
  findAll() {
    return this.groupsService.findAll();
  }

  /**
   * Get single Group Type controller
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single Group  data',
    example: '1',
  })
  @ApiOperation({
    summary: 'Get single Group  data.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne(id);
  }

  /**
   * Update single Group Type controller
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update Group',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single Group data.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  /**
   * Delete single Group   controller
   */
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete Groups',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single Groups data.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}
