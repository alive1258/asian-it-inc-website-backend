import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CollaborateService } from './collaborate.service';
import { CreateCollaborateDto } from './dto/create-collaborate.dto';
import { UpdateCollaborateDto } from './dto/update-collaborate.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCollaborateDto } from './dto/get-collaborate.dto';
import { Request } from 'express';

@Controller('collaborate')
@ApiTags('Collaborate')
export class CollaborateController {
  constructor(private readonly collaborateService: CollaborateService) {}

  /**
   * Create collaborate  controller
   */
  @Post()
  @ApiOperation({
    summary: 'Create a data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Data created successfully.',
  })
  create(
    @Req() req: Request,
    @Body() createCollaborateDto: CreateCollaborateDto,
  ) {
    return this.collaborateService.create(req, createCollaborateDto);
  }

  /**
   * Get all Collaborate controller
   */
  @Get('/all-collaborate')
  @ApiResponse({
    status: 200,
    description: 'Get all the data.',
  })
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
    summary: 'Get all the data.',
  })
  findAll(@Query() getCollaborateDto: GetCollaborateDto) {
    return this.collaborateService.findAll(getCollaborateDto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single Attendance data',
    example: '1',
  })
  @ApiOperation({
    summary: 'Get single Attendance data.',
  })
  findOne(@Param('id') id: string) {
    return this.collaborateService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update Attendance',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single Attendance data.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCollaborateDto: UpdateCollaborateDto,
  ) {
    return this.collaborateService.update(id, updateCollaborateDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete Attendance',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single Attendance data.',
  })
  remove(@Param('id') id: string) {
    return this.collaborateService.remove(id);
  }
}
