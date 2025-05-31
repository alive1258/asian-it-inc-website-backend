import { Controller, Get } from '@nestjs/common';
import { ServicesService } from './services.service';

import { ApiOperation } from '@nestjs/swagger';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.servicesService.findAll();
  }
}
