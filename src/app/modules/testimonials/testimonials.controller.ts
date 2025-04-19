import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Req() req: Request,
    @Body() createTestimonialDto: CreateTestimonialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.testimonialsService.create(req, createTestimonialDto, file);
  }

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.update(+id, updateTestimonialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(+id);
  }
}
