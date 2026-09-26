import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { ErrorCode } from "../constants/errorCodes";

export class ServiceError extends Error {
  code: ErrorCode;
  status: number;

  constructor(code: ErrorCode, status = 400, details?: Record<string, unknown>) {
    super(ERROR_MESSAGES[code]);
    this.name = "ServiceError";
    this.code = code;
    this.status = status;
    if (details) {
      Object.assign(this, { details });
    }
  }
}

export const notFound = (code: ErrorCode) => new ServiceError(code, 404);
export const conflict = (code: ErrorCode) => new ServiceError(code, 409);
export const unprocessable = (code: ErrorCode) => new ServiceError(code, 422);

export { ERROR_CODES };
