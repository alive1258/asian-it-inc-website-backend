import { Controller, Get } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';

import { ApiOperation } from '@nestjs/swagger';

@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.technologiesService.findAll();
  }
}
