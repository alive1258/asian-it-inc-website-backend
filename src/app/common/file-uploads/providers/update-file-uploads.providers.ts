import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { imageFileFilter } from '../uploads.utils';
import * as FormData from 'form-data';

@Injectable()
export class UpdateFileUploadsProvider {
  private readonly logger = new Logger(UpdateFileUploadsProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Function to handle updating an image by replacing the old image with a new one.
   * @param currentFile - The new image to be uploaded
   * @param oldFile - The existing image that needs to be replaced
   * @returns - A promise resolving to the updated image filename
   */
  public async handleUpdateFileUploads(
    currentFile: Express.Multer.File,
    oldFile: string,
  ): Promise<string> {
    if (!currentFile || !currentFile.buffer) {
      throw new BadRequestException('No file provided for update');
    }

    // Validate the file type using the custom imageFileFilter function
    try {
      await new Promise((resolve, reject) => {
        imageFileFilter(currentFile, (error, acceptFile) => {
          if (error) {
            reject(error);
          } else if (!acceptFile) {
            reject(new BadRequestException('Invalid file type!'));
          }
          resolve(null);
        });
      });
    } catch (error) {
      this.logger.error(`File validation failed: ${error.message}`);
      throw error;
    }

    // Check if the necessary configuration value is missing
    const imageUploadUrl = this.configService.get<string>(
      'appConfig.imageUploadUrl',
    );
    if (!imageUploadUrl) {
      throw new BadRequestException(
        'Image upload URL is not configured properly',
      );
    }

    try {
      // Prepare form data for the update
      const formData = new FormData();
      const blob = new Blob([currentFile.buffer], {
        type: currentFile.mimetype,
      });
      formData.append('newFile', blob, currentFile.originalname);
      formData.append('oldFile', oldFile);

      // Make a POST request to update the image on the external service
      const res = await this.httpService.axiosRef.post(
        `${imageUploadUrl}/update`,
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      if (res.status !== 200 || !res.data?.name) {
        throw new BadRequestException(
          'Failed to update the image on the remote server',
        );
      }

      // Log the successful update
      this.logger.log(`Successfully updated image: ${res.data.name}`);
      return res.data.name; // Return the updated file name
    } catch (error) {
      this.logger.error(`Error updating image: ${error.message}`, error.stack);
      throw new BadRequestException(`Image update failed: ${error.message}`);
    }
  }
}
