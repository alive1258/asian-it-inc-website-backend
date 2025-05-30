import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateAboutUsDto } from './dtos/create-about-us.dto';
import { AboutUsService } from './about-us.service';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) { }
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a  about us.' })
  @ApiResponse({
    status: 201,
    description: 'about us created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'about us already exists.' })
  create(
    @Req() req: Request,
    @Body() createAboutUsDto: CreateAboutUsDto,
  ) {
    return this.aboutUsService.createOrUpdate(req, createAboutUsDto);
  }
}
