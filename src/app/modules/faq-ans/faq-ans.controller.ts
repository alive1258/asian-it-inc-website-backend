import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FaqAnsService } from './faq-ans.service';
import { CreateFaqAnDto } from './dto/create-faq-an.dto';
import { UpdateFaqAnDto } from './dto/update-faq-an.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetFaqAnswerDto } from './dto/get-faq-an.dto';

@Controller('faq-ans')
export class FaqAnsController {
  constructor(private readonly faqAnsService: FaqAnsService) {}

  /**
   * Create an faqAns
   */

  @Post()
  @ApiOperation({
    summary: 'Create an faqAns.',
  })
  @ApiResponse({
    status: 201,
    description: 'faqAns created successfully.',
  })
  create(@Req() req: Request, @Body() createFaqAnDto: CreateFaqAnDto) {
    return this.faqAnsService.create(req, createFaqAnDto);
  }

  /**
   * Get all faqAns controller
   */
  @Get()
  @ApiQuery({
    name: 'limit',
    type: 'string',
    required: false,
    description: 'The number of entries returned per query',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    type: 'string',
    required: false,
    description: 'The page that wanted.',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    description: 'Search anything that you want.',
    example: 'First',
  })
  @ApiOperation({
    summary: 'Get all the faqAns data.',
  })
  findAll(@Query() getFaqAnswerDto: GetFaqAnswerDto) {
    return this.faqAnsService.findAll(getFaqAnswerDto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required to get single data',
    example: '4',
  })
  @ApiOperation({
    summary: 'Get single data.',
  })
  findOne(@Param('id') id: string) {
    return this.faqAnsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for update faq',
    example: '4',
  })
  @ApiOperation({
    summary: 'Update single faq data.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaqAnDto: UpdateFaqAnDto,
  ) {
    return this.faqAnsService.update(id, updateFaqAnDto);
  }
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The params is required for delete Member',
    example: '4',
  })
  @ApiOperation({
    summary: 'Delete single Member data.',
  })
  remove(@Param('id') id: string) {
    return this.faqAnsService.remove(id);
  }
}
