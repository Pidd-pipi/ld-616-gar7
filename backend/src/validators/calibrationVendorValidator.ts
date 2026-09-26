import { ServiceError, ERROR_CODES } from "../utils/ServiceError";
import type { VendorSuspendPayload } from "../types/CalibrationVendorPayload";

export const parseVendorSuspendPayload = (body: Record<string, unknown>): VendorSuspendPayload => ({
  reason:
    typeof body.reason === "string" && body.reason.trim().length > 0
      ? body.reason.trim()
      : (() => {
          throw new ServiceError(ERROR_CODES.REASON_REQUIRED, 422);
        })(),
  handled_by:
    typeof body.handled_by === "string" && body.handled_by.trim().length > 0
      ? body.handled_by.trim()
      : (() => {
          throw new ServiceError(ERROR_CODES.HANDLER_REQUIRED, 422);
        })()
});
