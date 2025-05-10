import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetExperienceDto } from './dto/get-experience.dto';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @UseInterceptors(FileInterceptor('photo'))
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
    @Body() createExperienceDto: CreateExperienceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.experienceService.create(req, createExperienceDto, file);
  }

  @Get('/all-experience')
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
  findAll(@Query() getExperienceDto: GetExperienceDto) {
    return this.experienceService.findAll(getExperienceDto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single data',
    example: '4',
  })
  @ApiOperation({
    summary: 'Get single data.',
  })
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(id);
  }

  @UseInterceptors(FileInterceptor('photo'))
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update faq',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single faq data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the Hero Section.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID or update data.' })
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.experienceService.update(id, updateExperienceDto, file);
  }

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
  remove(@Param('id') id: string) {
    return this.experienceService.remove(id);
  }
}
