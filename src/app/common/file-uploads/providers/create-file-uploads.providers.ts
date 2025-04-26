import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { imageFileFilter } from './uploads.utils';
import { fileNameEditor } from '../uploads.utils';

@Injectable()
export class FileUploadsProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Handles uploading of one or multiple image files.
   *
   * - Validates each file
   * - Sends to external image upload service
   * - Returns the uploaded file name(s)
   *
   * @param files - Single or multiple files from Multer
   * @returns Uploaded filename or array of filenames
   */
  public async handleFileUploads(
    files: Express.Multer.File | Express.Multer.File[],
  ): Promise<string[] | string> {
    if (!files) {
      throw new NotFoundException('No file(s) provided');
    }

    // If a single file is provided, convert it to an array for uniform processing
    const fileArray = Array.isArray(files) ? files : [files];

    try {
      const uploadPromises = fileArray.map(
        async (file: Express.Multer.File) => {
          let imageFile: string = '';

          // Validate the file type using the imageFileFilter
          await new Promise((resolve, reject) => {
            imageFileFilter(file, (error, acceptFile) => {
              if (error) {
                reject(error); // Reject if validation fails
              } else if (!acceptFile) {
                reject(new BadRequestException('Invalid file type!'));
              }
              resolve(null);
            });
          });

          // Edit the filename using fileNameEditor
          fileNameEditor(file, (error, filename) => {
            if (error) {
              throw new Error(`Filename error: ${error.message}`);
            }
            imageFile = filename;
          });

          // Create the file path (for saving locally or returning as a file path)
          const filePath = `public/uploads/${imageFile}`;

          // If the file needs to be uploaded (e.g., to an external service)
          if (file.mimetype === 'application/octet-stream' || file.buffer) {
            const blob = new Blob([file.buffer], { type: file.mimetype });
            const formData = new FormData();
            formData.append('file', blob, imageFile);

            try {
              const imageUploadUrl = this.configService.get<string>(
                'appConfig.imageUploadUrl',
              );

              const response = await this.httpService.axiosRef.post(
                `${imageUploadUrl}/upload`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                },
              );

              // Return the uploaded file name
              return response.data.name;
            } catch (error) {
              throw new BadRequestException(
                `File upload failed: ${error.message}`,
              );
            }
          }

          // If file is local, just save the path (for local storage, etc.)
          return filePath;
        },
      );

      const filePaths = await Promise.all(uploadPromises);

      // If there was a single file, return a single string, otherwise return an array of paths
      return filePaths.length === 1 ? filePaths[0] : filePaths;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`File upload error: ${error.message}`);
    }
  }
}
