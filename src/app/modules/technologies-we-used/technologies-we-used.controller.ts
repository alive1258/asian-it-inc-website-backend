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
import { TechnologiesWeUsedService } from './technologies-we-used.service';
import { CreateTechnologiesWeUsedDto } from './dto/create-technologies-we-used.dto';
import { UpdateTechnologiesWeUsedDto } from './dto/update-technologies-we-used.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetTechnologiesWeUsedDto } from './dto/get-technologies-we-used.dto';

@Controller('technologies-we-used')
export class TechnologiesWeUsedController {
  constructor(
    private readonly technologiesWeUsedService: TechnologiesWeUsedService,
  ) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FileInterceptor('icon')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new team member.' })
  @ApiResponse({
    status: 201,
    description: 'Team member created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Team member already exists.' })
  create(
    @Req() req: Request,
    @Body() createTechnologiesWeUsedDto: CreateTechnologiesWeUsedDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.technologiesWeUsedService.create(
      req,
      createTechnologiesWeUsedDto,
      file,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all team members with filters and pagination.',
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
  findAll(@Query() getTechnologiesWeUsedDto: GetTechnologiesWeUsedDto) {
    return this.technologiesWeUsedService.findAll(getTechnologiesWeUsedDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single team member by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Team member ID.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Team member found.' })
  @ApiResponse({ status: 404, description: 'Team member not found.' })
  findOne(@Param('id') id: string) {
    return this.technologiesWeUsedService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @UseInterceptors(FileInterceptor('photo'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a team member by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Team member ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() updateTechnologiesWeUsedDto: UpdateTechnologiesWeUsedDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.technologiesWeUsedService.update(
      id,
      updateTechnologiesWeUsedDto,
      file,
    );
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team member by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Team member ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Team member not found.' })
  remove(@Param('id') id: string) {
    return this.technologiesWeUsedService.remove(id);
  }
}
