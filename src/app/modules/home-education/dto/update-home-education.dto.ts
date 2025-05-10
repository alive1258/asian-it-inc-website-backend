import { PartialType } from '@nestjs/swagger';
import { CreateHomeEducationDto } from './create-home-education.dto';

export class UpdateHomeEducationDto extends PartialType(CreateHomeEducationDto) {}
