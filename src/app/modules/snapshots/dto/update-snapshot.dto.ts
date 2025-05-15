import { PartialType } from '@nestjs/swagger';
import { CreateSnapshotDto } from './create-snapshot.dto';

export class UpdateSnapshotDto extends PartialType(CreateSnapshotDto) {}
