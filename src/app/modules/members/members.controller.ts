import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetMemberDto } from './dto/get-members.dto';
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /**
   * Create Member  controller
   */
  @Post()
  @ApiOperation({
    summary: 'Create a Member  data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Member  Data created successfully.',
  })
  create(@Req() req: Request, @Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(req, createMemberDto);
  }

  /**
   * Get all Member controller
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
    summary: 'Get all the Member data.',
  })
  findAll(@Req() req: Request, @Query() getMemberDto: GetMemberDto) {
    return this.membersService.findAll(req, getMemberDto);
  }

  /**
   * Get single Member Type controller
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single Member  data',
    example: '1',
  })
  @ApiOperation({
    summary: 'Get single Member  data.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(id);
  }

  /**
   * Update single Member Type controller
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update Member',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single Member data.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, updateMemberDto);
  }

  /**
   * Delete single Member controller
   */
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete Member',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single Member data.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.remove(id);
  }
}
