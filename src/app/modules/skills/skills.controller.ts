import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { GetSkillsDto } from './dto/get-skills.dto';

@Controller('skills')
@ApiTags('Skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // ✅ Create new Skills (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a new Skills' })
  @ApiResponse({
    status: 200,
    description: 'Skills created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  create(@Req() req: Request, @Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(req, createSkillDto);
  }

  // ✅ Get all Skillss (Public)

  // ✅ Get all Skillss (Public)
  @Get()
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    example: 'Manager',
    description: 'Search keyword',
  })
  @ApiOperation({ summary: 'Get all Skills with pagination & search' })
  @ApiResponse({
    status: 200,
    description: 'Skills retrieved successfully.',
  })
  findAll(@Query() getSkillsDto: GetSkillsDto) {
    return this.skillsService.findAll(getSkillsDto);
  }

  // ✅ Get single Skills by ID (Public)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Skills ID',
  })
  @ApiOperation({ summary: 'Get a Skills by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skills retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Skills not found.' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  // ✅ Update Skills by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60 } })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Skills ID to update',
  })
  @ApiOperation({ summary: 'Update a Skills by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skills updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or ID format.' })
  @ApiResponse({ status: 404, description: 'Skills not found.' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  // ✅ Delete Skills by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60 } })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Skills ID to delete',
  })
  @ApiOperation({ summary: 'Delete a Skills by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skills deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'Skills not found.' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
