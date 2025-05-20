import { PartialType } from '@nestjs/swagger';
import { CreateHomeHeroDto } from './create-home-hero.dto';

export class UpdateHomeHeroDto extends PartialType(CreateHomeHeroDto) {}
