import { Injectable } from '@nestjs/common';
import { CreateFaqAnDto } from './dto/create-faq-an.dto';
import { UpdateFaqAnDto } from './dto/update-faq-an.dto';

@Injectable()
export class FaqAnsService {
  create(createFaqAnDto: CreateFaqAnDto) {
    return 'This action adds a new faqAn';
  }

  findAll() {
    return `This action returns all faqAns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} faqAn`;
  }

  update(id: number, updateFaqAnDto: UpdateFaqAnDto) {
    return `This action updates a #${id} faqAn`;
  }

  remove(id: number) {
    return `This action removes a #${id} faqAn`;
  }
}
