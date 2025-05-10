import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, UploadedFile, Query } from '@nestjs/common';
import { MyHobbiesService } from './my-hobbies.service';
import { CreateMyHobbyDto } from './dto/create-my-hobby.dto';
import { UpdateMyHobbyDto } from './dto/update-my-hobby.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetMyHobbyDto } from './dto/get-my-hobby.dto';

@Controller('my-hobbies')
export class MyHobbiesController {
  constructor(private readonly myHobbiesService: MyHobbiesService) {}


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
    @Req() req:Request,
    @Body() createMyHobbyDto: CreateMyHobbyDto,
  @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.myHobbiesService.create(req,createMyHobbyDto, file);
  }

  @Get("/all-my-hobbies")
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
  findAll(@Query() getMyHobbyDto: GetMyHobbyDto) {
    return this.myHobbiesService.findAll(getMyHobbyDto);
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
    return this.myHobbiesService.findOne(id);
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
  update(@Param('id') id: string, @Body() updateMyHobbyDto: UpdateMyHobbyDto,
@UploadedFile() file?: Express.Multer.File, 
) {
    return this.myHobbiesService.update(id, updateMyHobbyDto,file);
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
    return this.myHobbiesService.remove(id);
  }
}
