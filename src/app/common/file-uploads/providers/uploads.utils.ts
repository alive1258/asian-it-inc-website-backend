import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';

/**
 * Generates a unique filename by appending the current timestamp to the original file name.
 */
export const fileNameEditor = (
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const fileExtension = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, fileExtension);
  const timestamp = Date.now();
  const newFileName = `${baseName}_${timestamp}${fileExtension}`;

  callback(null, newFileName);
};

/**
 * Filters uploaded files to allow only specific image file types.
 */
export const imageFileFilter = (
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
    // Reject non-image files with a BadRequestException
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }

  // Accept the file if it's a valid image type
  callback(null, true);
};
