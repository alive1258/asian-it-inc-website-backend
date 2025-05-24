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
import { TeamMemberSocialLinksService } from './team-member-social-links.service';
import { CreateTeamMemberSocialLinkDto } from './dto/create-team-member-social-link.dto';
import { UpdateTeamMemberSocialLinkDto } from './dto/update-team-member-social-link.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetTeamMemberSocialLinkDto } from './dto/get-team-member-social-link.dto';

@Controller('team-member-social-links')
export class TeamMemberSocialLinksController {
  constructor(
    private readonly teamMemberSocialLinksService: TeamMemberSocialLinksService,
  ) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 6, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @Post()
  @ApiOperation({ summary: 'Create a new team member SocialLinksassociation.' })
  @ApiResponse({
    status: 201,
    description: 'Team member SocialLinks created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 409, description: 'Conflict. Entry already exists.' })
  create(
    @Req() req: Request,
    @Body() createTeamMemberSocialLinkDto: CreateTeamMemberSocialLinkDto,
  ) {
    return this.teamMemberSocialLinksService.create(
      req,
      createTeamMemberSocialLinkDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve a paginated list of team member SocialLinks.',
  })
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
    description: 'Search term to filter team members by name or SocialLinks',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    example: true,
    description: 'Filter by active status.',
  })
  @ApiResponse({ status: 200, description: 'List of team member SocialLinks.' })
  findAll(@Query() getTeamMemberSocialLinkDto: GetTeamMemberSocialLinkDto) {
    return this.teamMemberSocialLinksService.findAll(
      getTeamMemberSocialLinkDto,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific team member SocialLinks.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the team member SocialLinks.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Team member SocialLinks found.' })
  @ApiResponse({
    status: 404,
    description: 'Team member SocialLinks not found.',
  })
  findOne(@Param('id') id: string) {
    return this.teamMemberSocialLinksService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing team member SocialLinks.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the team member SocialLinks to update.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member SocialLinks updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or bad request.' })
  @ApiResponse({
    status: 404,
    description: 'Team member SocialLinks not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateTeamMemberSocialLinkDto: UpdateTeamMemberSocialLinkDto,
  ) {
    return this.teamMemberSocialLinksService.update(
      id,
      updateTeamMemberSocialLinkDto,
    );
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team member SocialLinks by ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the team member SocialLinks to delete.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member SocialLinks deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Team member SocialLinks not found.',
  })
  remove(@Param('id') id: string) {
    return this.teamMemberSocialLinksService.remove(id);
  }
}
