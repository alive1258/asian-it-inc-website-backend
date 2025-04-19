import { Injectable } from '@nestjs/common';
import { FileUploadsProvider } from './providers/create-file-uploads.providers';
import { UpdateFileUploadsProvider } from './providers/update-file-uploads.providers';
import { DeleteFileUploadsProvider } from './providers/delate-file-uploads.providers';

@Injectable()
export class FileUploadsService {
  constructor(
    /**
     * Inject Providers
     */
    private readonly fileUploadsProvider: FileUploadsProvider,
    private readonly updateFileUploadsProvider: UpdateFileUploadsProvider,
    private readonly deleteFileUploadsProvider: DeleteFileUploadsProvider,
  ) {}

  /**
   * Upload file?files
   */

  public async fileUploads(
    files: Express.Multer.File | Express.Multer.File[],
  ): Promise<string | string[]> {
    return await this.fileUploadsProvider.handleFileUploads(files);
  }

  /**
   * update file
   */

  public async updateFileUploads({
    currentFile,
    oldFile,
  }: {
    currentFile: Express.Multer.File;
    oldFile: string;
  }): Promise<string> {
    return await this.updateFileUploadsProvider.handleUpdateFileUploads(
      currentFile,
      oldFile,
    );
  }
  /**
   * Delete file
   */
  public async deleteFileUploads(currentFile: string): Promise<string> {
    return await this.deleteFileUploadsProvider.handleDeleteFileUploads(
      currentFile,
    );
  }
}
