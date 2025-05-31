import { Controller, Get } from '@nestjs/common';
import { ClientsService } from './clients.service';

import { ApiOperation } from '@nestjs/swagger';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.clientsService.findAll();
  }
}
