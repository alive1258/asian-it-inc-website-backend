import { PartialType } from '@nestjs/swagger';
import { CreateWorkGalleryDto } from './create-work-gallery.dto';

export class UpdateWorkGalleryDto extends PartialType(CreateWorkGalleryDto) {}
