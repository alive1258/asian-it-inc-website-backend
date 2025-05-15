import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ExtraCurriculumService } from './extra-curriculum.service';
import { CreateExtraCurriculumDto } from './dto/create-extra-curriculum.dto';
import { UpdateExtraCurriculumDto } from './dto/update-extra-curriculum.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetExtraCurriculumCategoryDto } from '../extra-curriculum-category/dto/get-extra-curriculum-category.dto';

@Controller('extra-curriculum')
export class ExtraCurriculumController {
  constructor(
    private readonly extraCurriculumService: ExtraCurriculumService,
  ) {}

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
    @Body() createExtraCurriculumDto: CreateExtraCurriculumDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.extraCurriculumService.create(
      req,
      createExtraCurriculumDto,
      file,
    );
  }

  @Get('/all-extra-curriculums')
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
  findAll(
    @Query() getExtraCurriculumCategoryDto: GetExtraCurriculumCategoryDto,
  ) {
    return this.extraCurriculumService.findAll(getExtraCurriculumCategoryDto);
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
    return this.extraCurriculumService.findOne(id);
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
    @Body() updateExtraCurriculumDto: UpdateExtraCurriculumDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.extraCurriculumService.update(
      id,
      updateExtraCurriculumDto,
      file,
    );
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
    return this.extraCurriculumService.remove(id);
  }
}
