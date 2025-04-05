import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Result, ErrorType } from "../types";

@Injectable()
export class ErrorHandlerService {
  handleError<T>(result: Result<T>): T {
    if (result.isFailure) {
      const error = result.error;
      switch (error?.type) {
        case ErrorType.VALIDATION:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        case ErrorType.NOT_FOUND:
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        case ErrorType.DATABASE:
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        default:
          throw new HttpException(
            "Error interno del servidor",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
      }
    }

    return result.getValue();
  }
}
