import { PartialType } from '@nestjs/swagger';
import { CreateAboutMeDto } from './create-about-me.dto';

export class UpdateAboutMeDto extends PartialType(CreateAboutMeDto) {}
