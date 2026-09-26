import { ERROR_CODES } from "../constants/errorCodes";
import type { ErrorCode } from "../constants/errorCodes";

export class HttpError extends Error {
  status: number;
  code: ErrorCode;
  constructor(status: number, code: ErrorCode, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
    this.code = code;
  }
}

export const notFoundError = (code: ErrorCode, message: string) => new HttpError(404, code, message);
export const conflictError = (code: ErrorCode, message: string) => new HttpError(409, code, message);
export const validationError = (message: string, code: ErrorCode = ERROR_CODES.VALIDATION_FAILED) =>
  new HttpError(400, code, message);
