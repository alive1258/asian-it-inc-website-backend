import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
/**
 * Generates a unique filename by appending the current timestamp to the original file name.
 * * This helps prevent filename collisions when storing uploaded files.
 *  * @param file - The uploaded file object provided by Multer
 * @param callback - A callback function to return the generated filename or an error
 */

export const fileNameEditor = (
  file: Express.Multer.File,
  callback: (error: Error | null, fileName: string) => void,
) => {
  // Extract the file extension (e.g., .jpg, .png)
  const fileExtension = path.extname(file.originalname);

  // Extract the base name of the file without the extension
  const baseName = path.basename(file.originalname, fileExtension);

  // Get the current timestamp to ensure filename uniqueness
  const timestamp = Date.now();

  // Construct the new unique filename
  const newFileName = `${baseName}-${timestamp}${fileExtension}`;

  // Pass the new filename back via the callback
  callback(null, newFileName);
};

/**
 * Multer file filter to validate uploaded files as supported image types.
 * Only allows JPG, JPEG, PNG, and GIF formats.
 *
 * @param file - The uploaded file object from Multer (Express.Multer.File)
 * @param callback - Callback to accept or reject the file
 */
export const imageFileFilter = (
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Define allowed MIME types using regex
  const isImage = /^image\/(jpg|jpeg|png|gif)$/.test(file.mimetype);

  if (!isImage) {
    // Reject the file if it's not an allowed image type
    return callback(
      new BadRequestException(
        'Only image files (JPG, JPEG, PNG, GIF) are allowed!',
      ),
      false,
    );
  }

  // Accept the file if it's a valid image type
  callback(null, true);
};
