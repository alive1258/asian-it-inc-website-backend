import { Injectable } from '@nestjs/common';
import { CreateWorkGalleryDto } from './dto/create-work-gallery.dto';
import { UpdateWorkGalleryDto } from './dto/update-work-gallery.dto';

@Injectable()
export class WorkGalleryService {
  create(createWorkGalleryDto: CreateWorkGalleryDto) {
    return 'This action adds a new workGallery';
  }

  findAll() {
    return `This action returns all workGallery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workGallery`;
  }

  update(id: number, updateWorkGalleryDto: UpdateWorkGalleryDto) {
    return `This action updates a #${id} workGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} workGallery`;
  }
}
