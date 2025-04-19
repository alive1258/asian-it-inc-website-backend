import { Global, Module } from '@nestjs/common';
import { FileUploadsService } from './file-uploads.service';
import { FileUploadsProvider } from './providers/create-file-uploads.providers';
import { UpdateFileUploadsProvider } from './providers/update-file-uploads.providers';
import { DeleteFileUploadsProvider } from './providers/delate-file-uploads.providers';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  providers: [
    FileUploadsService,
    FileUploadsProvider,
    UpdateFileUploadsProvider,
    DeleteFileUploadsProvider,
  ],
  imports: [HttpModule],
  exports: [FileUploadsService],
})
export class FileUploadsModule {}
