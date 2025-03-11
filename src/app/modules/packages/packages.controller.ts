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
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetPackagesDto } from './dto/get.packages.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  /**
   * Create Packages  controller
   */
  @Post()
  @ApiOperation({
    summary: 'Create a Packages  data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Packages  Data created successfully.',
  })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  /**
   * Get all Packages controller
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
    summary: 'Get all the Packages data.',
  })
  findAll(@Req() req: Request, @Query() getPackagesDto: GetPackagesDto) {
    return this.packagesService.findAll(req, getPackagesDto);
  }

  /**
   * Get single Packages Type controller
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single Packages  data',
    example: '1',
  })
  @ApiOperation({
    summary: 'Get single Packages  data.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packagesService.findOne(id);
  }

  /**
   * Update single Packages Type controller
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update Packages',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single Packages data.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packagesService.update(id, updatePackageDto);
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
    return this.packagesService.remove(id);
  }
}
