import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Bad Request
    const status = 400;

    // Type assertion to tell TypeScript that exception is a QueryFailedError
    const error = exception as QueryFailedError & {
      driverError: { code: string; detail?: string };
    };

    // Extract the error code from driverError (ensure it exists)
    const errorCode = error.driverError?.code;
    const errorDetail = error.driverError?.detail;

    // Handle errors based on the SQL error code
    let errorMessage = this.getErrorMessage(
      errorCode,
      error.driverError?.detail,
    );

    console.log('ErrorMessage', error?.message);
    console.log('Error', error);

    // If no specific message is found, use the default error message
    if (!errorMessage) {
      errorMessage = 'An unexpected error occurred. Please try again later.';
    }

    return response.status(status).json({
      statusCode: status,
      message: errorMessage,
      error: 'Bad Request',
    });
  }

  // Organized method to map error codes to user-friendly messages
  private getErrorMessage(errorCode: string, detail?: string): string | null {
    switch (errorCode) {
      // Foreign key violation
      case '23503':
        return (
          detail ??
          'Cannot delete or modify this record as it is referenced by other records.'
        );

      // Unique constraint violation
      case '23505':
        return detail ?? 'Duplicate entry found. This record already exists.';

      // Invalid text representation (e.g., invalid UUID)
      case '22P02':
        return (
          detail ??
          'Invalid input format. Please check your data and try again.'
        );

      // Undefined column
      case '42703':
        return detail ?? 'Invalid query. One of the columns does not exist.';

      // Check constraint violation
      case '23514':
        return (
          detail ??
          'Failed to satisfy a database constraint. Please check your data.'
        );

      // Not-null constraint violation
      case '23502':
        return 'A required field is missing. Please provide all necessary information and try again.';

      // Return null if no specific error code handling is provided
      default:
        return null;
    }
  }
}
