import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ErrorMessages } from './constants/errorMessages'; // Adjust the path as necessary

@Catch(Error)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status;
    let message;

    switch (error.message) {
      case ErrorMessages.UserNotFound:
        status = HttpStatus.NOT_FOUND;
        message = ErrorMessages.UserNotFound;
        break;

      case ErrorMessages.InvalidCredentials:
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessages.InvalidCredentials;
        break;

      case ErrorMessages.InvalidOrExpiredKey:
        status = HttpStatus.UNAUTHORIZED;
        message = ErrorMessages.InvalidOrExpiredKey;
        break;

      case ErrorMessages.BearerTokenMissing:
        status = HttpStatus.UNAUTHORIZED;
        message = ErrorMessages.BearerTokenMissing;
        break;

      case ErrorMessages.AuthorizationHeaderMissing:
        status = HttpStatus.UNAUTHORIZED;
        message = ErrorMessages.AuthorizationHeaderMissing;
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = ErrorMessages.TokenGenerationFailed;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
