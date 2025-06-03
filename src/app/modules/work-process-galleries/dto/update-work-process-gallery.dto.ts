import { PartialType } from '@nestjs/swagger';
import { CreateWorkProcessGalleryDto } from './create-work-process-gallery.dto';

export class UpdateWorkProcessGalleryDto extends PartialType(CreateWorkProcessGalleryDto) {}
