import { PartialType } from '@nestjs/swagger';
import { CreateHomeHeroSectionDto } from './create-home-hero-section.dto';

export class UpdateHomeHeroSectionDto extends PartialType(
  CreateHomeHeroSectionDto,
) {}
