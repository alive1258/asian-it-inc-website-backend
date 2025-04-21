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
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetFaqDto } from './dto/get-faqs.dto';
import { Request } from 'express';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  create(
    // @ActiveUser('sub') userId: string,
    @Req() req: Request,
    @Body() createFaqDto: CreateFaqDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.faqsService.create(req, createFaqDto, file);
  }

  /**
   * Get all faqs controller
   */
  @Get('/all-faqs')
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
    summary: 'Get all the faqs data.',
  })
  public async findAll(@Query() getFaqDto: GetFaqDto) {
    return this.faqsService.findAll(getFaqDto);
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqsService.findOne(+id);
  }
  @UseInterceptors(FileInterceptor('photo'))
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
    @Param('id') id: string,
    @Body() updateFaqDto: UpdateFaqDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.faqsService.update(id, updateFaqDto, file);
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faqsService.remove(id);
  }
}
