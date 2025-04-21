import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { imageFileFilter } from '../uploads.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UpdateFileUploadsProvider {
  constructor(
    /**
     * Inject services
     */
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Function to handle updating an image by replacing the old image with a new one.
   * @param currentImage - The new image to be uploaded
   * @param oldImage - The existing image that needs to be replaced
   * @returns - A promise resolving to the updated image filename
   */
  public async handleUpdateFileUploads(
    currentFile: Express.Multer.File,
    oldFile: string,
  ): Promise<string> {
    let updatedFileName = oldFile;

    await new Promise((resolve, reject) => {
      imageFileFilter(currentFile, (error, acceptFile) => {
        if (error) {
          reject(error); // Reject if validation fails
        } else if (!acceptFile) {
          reject(new BadRequestException('Invalid file type!'));
        }
        resolve(null);
      });
    });

    // Check if a new image is provided
    if (currentFile?.buffer) {
      try {
        const imageUploadUrl = this.configService.get<string>(
          'appConfig.imageUploadUrl',
        );

        // Prepare form data with the new and old image files
        const formData = new FormData();

        // Convert the buffer to Blob using the form-data library
        const blob = new Blob([currentFile.buffer], {
          type: currentFile.mimetype,
        });

        // Append the files to the form data
        formData.append('newFile', blob, currentFile.originalname);
        formData.append('oldFile', oldFile);

        // Make a POST request to update the image on the external service
        const res = await this.httpService.axiosRef.post(
          `${imageUploadUrl}/update`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        // Check if the response contains the expected data
        const photo = res?.data?.name;

        if (!photo) {
          throw new BadRequestException(
            'The response did not contain a valid photo name.',
          );
        }

        // Update the filename with the new photo name
        updatedFileName = photo;
      } catch (error) {
        console.error('Error updating image:', error?.message);
        throw new BadRequestException(`Image update failed: ${error?.message}`);
      }
    }

    // Return the updated image filename
    return updatedFileName;
  }
}
