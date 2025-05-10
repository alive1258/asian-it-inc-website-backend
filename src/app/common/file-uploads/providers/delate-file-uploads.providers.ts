import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';

@Injectable()
export class DeleteFileUploadsProvider {
  private readonly logger = new Logger(DeleteFileUploadsProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Handles deletion of an uploaded image file from the external service.
   * @param currentFile - The file name to delete.
   * @returns - The name of the deleted file or a confirmation string.
   */
  public async handleDeleteFileUploads(currentFile: string): Promise<string> {
    if (!currentFile) {
      throw new NotFoundException('No file provided for deletion');
    }

    try {
      const imageUploadUrl = this.configService.get<string>(
        'appConfig.imageUploadUrl',
      );

      if (!imageUploadUrl) {
        throw new BadRequestException(
          'Image upload URL is not configured properly',
        );
      }

      // Prepare FormData with the old file
      const formData = new FormData();
      formData.append('oldFile', currentFile);

      // Send deletion request
      const response = await this.httpService.axiosRef.post(
        `${imageUploadUrl}/delete`,
        formData,

        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status !== 200 || !response.data?.status) {
        throw new BadRequestException(
          'Failed to delete the file on remote server',
        );
      }

      return response.data.status;
    } catch (error) {
      this.logger.error(
        `Error deleting file "${currentFile}": ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `File deletion failed: ${error?.message || 'Unknown error'}`,
      );
    }
  }
}
