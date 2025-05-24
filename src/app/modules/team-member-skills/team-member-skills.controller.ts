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
import { TeamMemberSkillsService } from './team-member-skills.service';
import { CreateTeamMemberSkillDto } from './dto/create-team-member-skill.dto';
import { UpdateTeamMemberSkillDto } from './dto/update-team-member-skill.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetTeamMemberSkillDto } from './dto/get-team-member-skill.dto';

@Controller('team-member-skills')
export class TeamMemberSkillsController {
  constructor(
    private readonly teamMemberSkillsService: TeamMemberSkillsService,
  ) {}
  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @Post()
  @ApiOperation({ summary: 'Create a new team member skill association.' })
  @ApiResponse({
    status: 201,
    description: 'Team member skill created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 409, description: 'Conflict. Entry already exists.' })
  create(
    @Req() req: Request,
    @Body() createTeamMemberSkillDto: CreateTeamMemberSkillDto,
  ) {
    return this.teamMemberSkillsService.create(req, createTeamMemberSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of team member skills.' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'John',
    description: 'Search term to filter team members by name or skill.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    example: true,
    description: 'Filter by active status.',
  })
  @ApiResponse({ status: 200, description: 'List of team member skills.' })
  findAll(@Query() getTeamMemberSkillDto: GetTeamMemberSkillDto) {
    return this.teamMemberSkillsService.findAll(getTeamMemberSkillDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific team member skill.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the team member skill.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Team member skill found.' })
  @ApiResponse({ status: 404, description: 'Team member skill not found.' })
  findOne(@Param('id') id: string) {
    return this.teamMemberSkillsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing team member skill.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the team member skill to update.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member skill updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or bad request.' })
  @ApiResponse({ status: 404, description: 'Team member skill not found.' })
  update(
    @Param('id') id: string,
    @Body() updateTeamMemberSkillDto: UpdateTeamMemberSkillDto,
  ) {
    return this.teamMemberSkillsService.update(id, updateTeamMemberSkillDto);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team member skill by ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the team member skill to delete.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member skill deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Team member skill not found.' })
  remove(@Param('id') id: string) {
    return this.teamMemberSkillsService.remove(id);
  }
}
