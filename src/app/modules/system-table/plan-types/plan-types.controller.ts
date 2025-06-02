import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanTypesService } from './plan-types.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('plan-types')
export class PlanTypesController {
  constructor(private readonly planTypesService: PlanTypesService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.planTypesService.findAll();
  }
}
