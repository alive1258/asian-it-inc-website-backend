import { PartialType } from '@nestjs/swagger';
import { CreateHomeAboutSectionDto } from './create-home-about-section.dto';

export class UpdateHomeAboutSectionDto extends PartialType(CreateHomeAboutSectionDto) {}
