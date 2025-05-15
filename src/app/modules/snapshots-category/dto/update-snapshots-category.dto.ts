import { PartialType } from '@nestjs/swagger';
import { CreateSnapshotsCategoryDto } from './create-snapshots-category.dto';

export class UpdateSnapshotsCategoryDto extends PartialType(CreateSnapshotsCategoryDto) {}
