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
import { HomeHeroSectionService } from './home-hero-section.service';
import { CreateHomeHeroSectionDto } from './dto/create-home-hero-section.dto';
import { UpdateHomeHeroSectionDto } from './dto/update-home-hero-section.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetHomeHeroSectionDto } from './dto/get-home-hero-section.dto';

@Controller('home-hero-section')
export class HomeHeroSectionController {
  constructor(
    private readonly homeHeroSectionService: HomeHeroSectionService,
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
    @Body() createHomeHeroSectionDto: CreateHomeHeroSectionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeHeroSectionService.create(
      req,
      createHomeHeroSectionDto,
      file,
    );
  }

  @Get('/all-home-hero-section')
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
  findAll(@Query() getHomeHeroSectionDto: GetHomeHeroSectionDto) {
    return this.homeHeroSectionService.findAll(getHomeHeroSectionDto);
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
    return this.homeHeroSectionService.findOne(id);
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
    @Body() updateHomeHeroSectionDto: UpdateHomeHeroSectionDto,

    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeHeroSectionService.update(
      id,
      updateHomeHeroSectionDto,
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
    return this.homeHeroSectionService.remove(id);
  }
}
