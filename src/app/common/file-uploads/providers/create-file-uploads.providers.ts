import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { imageFileFilter } from '../uploads.utils';

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
  ): Promise<string | string[]> {
    // Guard clause: no file(s) provided
    if (!files) {
      throw new NotFoundException('No file(s) provided');
    }

    // Normalize the input to always be an array
    const fileArray = Array.isArray(files) ? files : [files];

    // Upload each file asynchronously
    const uploadedFileNames = await Promise.all(
      fileArray.map((file) => this.uploadSingleFile(file)),
    );

    // Return a single name or array depending on the original input
    return uploadedFileNames.length === 1
      ? uploadedFileNames[0]
      : uploadedFileNames;
  }

  /**
   * Uploads a single image file after validation.
   *
   * @param file - Multer file object
   * @returns The uploaded file's name
   */
  private async uploadSingleFile(file: Express.Multer.File): Promise<string> {
    // Validate the image MIME type
    await this.validateImageFile(file);

    // Guard clause: check for buffer availability
    if (!file.buffer) {
      throw new BadRequestException('File buffer is empty');
    }

    // Convert the buffer into a Blob and prepare it for form-data submission
    const blob = new Blob([file.buffer], { type: file.mimetype });
    const formData = new FormData();
    formData.append('file', blob);

    // Get external upload service URL from environment config
    const uploadUrl = this.configService.get<string>(
      'appConfig.imageUploadUrl',
    );
    if (!uploadUrl) {
      throw new BadRequestException('Image upload URL is not configured');
    }

    try {
      // Send file to upload endpoint using axios
      const response = await this.httpService.axiosRef.post(
        `${uploadUrl}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      // Ensure a file name is returned from the response
      const uploadedName = response.data?.name;
      if (!uploadedName) {
        throw new BadRequestException(
          'Upload succeeded but no file name returned',
        );
      }

      return uploadedName;
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Validates that the provided file is a supported image type.
   * Allowed types: JPG, JPEG, PNG, GIF
   *
   * @param file - File to be validated
   * @throws BadRequestException if file is invalid
   */
  private async validateImageFile(file: Express.Multer.File): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      imageFileFilter(file, (error, acceptFile) => {
        if (error || !acceptFile) {
          return reject(
            error ?? new BadRequestException('Invalid image file type!'),
          );
        }
        resolve();
      });
    });
  }
}

// import { HttpService } from '@nestjs/axios';
// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import {  imageFileFilter } from '../uploads.utils';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class FileUploadsProvider {
//   constructor(
//     private readonly httpService: HttpService,
//     private readonly configService: ConfigService,
//   ) {}

//   /**
//    * Handles single or multiple image file uploads.
//    * Validates file type and uploads it to an external service.
//    *
//    * @param files - A single file or an array of files
//    * @returns A single file name or an array of file names
//    */
//   public async handleFileUploads(
//     files: Express.Multer.File | Express.Multer.File[],
//   ): Promise<string | string[]> {
//     if (!files) {
//       throw new NotFoundException('No file(s) provided');
//     }

//     // Normalize input: always work with an array
//     const fileArray = Array.isArray(files) ? files : [files];

//     // Process all files asynchronously
//     const uploadedFileNames = await Promise.all(
//       fileArray.map(async (file) => {
//         // Validate the file type
//         await this.validateImageFile(file);

//         // Prepare the file blob for upload
//         const blob = new Blob([file.buffer], { type: file.mimetype });
//         const formData = new FormData();
//         formData.append('file', blob);

//         // Get upload URL from configuration
//         const uploadUrl = this.configService.get<string>('appConfig.imageUploadUrl');
//         if (!uploadUrl) {
//           throw new BadRequestException('Upload URL is not configured');
//         }

//         try {
//           // Upload the file using axios (through NestJS HttpService)
//           const response = await this.httpService.axiosRef.post(
//             `${uploadUrl}/upload`,
//             formData,
//             {
//               headers: {
//                 'Content-Type': 'multipart/form-data',
//               },
//             },
//           );

//           // Return the uploaded file name from the response
//           return response.data?.name || 'unknown_filename';
//         } catch (error) {
//           throw new BadRequestException(`Upload failed: ${error.message}`);
//         }
//       }),
//     );

//     // Return single file name or array of names based on input
//     return uploadedFileNames.length === 1 ? uploadedFileNames[0] : uploadedFileNames;
//   }

//   /**
//    * Validates whether the uploaded file is an image.
//    * Throws a BadRequestException if not valid.
//    *
//    * @param file - The file to validate
//    */
//   private async validateImageFile(file: Express.Multer.File): Promise<void> {
//     await new Promise<void>((resolve, reject) => {
//       imageFileFilter(file, (error, acceptFile) => {
//         if (error) {
//           return reject(error);
//         }

//         if (!acceptFile) {
//           return reject(new BadRequestException('Invalid image file type!'));
//         }

//         resolve();
//       });
//     });
//   }
// }
