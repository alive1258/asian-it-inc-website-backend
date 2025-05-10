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
import { HomeAboutSectionService } from './home-about-section.service';
import { CreateHomeAboutSectionDto } from './dto/create-home-about-section.dto';
import { UpdateHomeAboutSectionDto } from './dto/update-home-about-section.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetHomeAboutSectionDto } from './dto/get-home-about-section.dto';

@Controller('home-about-section')
export class HomeAboutSectionController {
  constructor(
    private readonly homeAboutSectionService: HomeAboutSectionService,
  ) {}

  @UseInterceptors(FileInterceptor('thumbnail_image'))
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
    @Body() createHomeAboutSectionDto: CreateHomeAboutSectionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeAboutSectionService.create(
      req,
      createHomeAboutSectionDto,
      file,
    );
  }

  @Get('/all-home-about-section')
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
  findAll(@Query() getHomeAboutSectionDto: GetHomeAboutSectionDto) {
    return this.homeAboutSectionService.findAll(getHomeAboutSectionDto);
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
    return this.homeAboutSectionService.findOne(id);
  }

  @UseInterceptors(FileInterceptor('thumbnail_image'))
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
    @Body() updateHomeAboutSectionDto: UpdateHomeAboutSectionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeAboutSectionService.update(
      id,
      updateHomeAboutSectionDto,
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
    return this.homeAboutSectionService.remove(id);
  }
}
