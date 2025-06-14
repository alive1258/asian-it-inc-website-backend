import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetPortfolioDto } from './dto/get-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  @ApiOperation({ summary: 'Create a new portfolio entry.' })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Portfolio already exists.' })
  create(
    @Req() req: Request,
    @Body() createPortfolioDto: CreatePortfolioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.portfolioService.create(req, createPortfolioDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all portfolio with filters and pagination.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '10' })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'John' })
  @ApiQuery({
    name: 'anyFilterField',
    required: false,
    type: String,
    example: 'active',
    description: 'Any custom filter field (e.g., status).',
  })
  findAll(@Query() getPortfolioDto: GetPortfolioDto) {
    return this.portfolioService.findAll(getPortfolioDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single portfolio by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'portfolio ID.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'portfolio found.' })
  @ApiResponse({ status: 404, description: 'portfolio not found.' })
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @UseInterceptors(FileInterceptor('photo'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a portfolio by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'portfolio ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'portfolio updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.portfolioService.update(id, updatePortfolioDto, file);
  }
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'portfolio ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'portfolio deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'portfolio not found.' })
  remove(@Param('id') id: string) {
    return this.portfolioService.remove(id);
  }
}
