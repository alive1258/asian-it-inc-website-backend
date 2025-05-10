import { PartialType } from '@nestjs/swagger';
import { CreateMyHobbyDto } from './create-my-hobby.dto';

export class UpdateMyHobbyDto extends PartialType(CreateMyHobbyDto) {}
