import { ServiceError, ERROR_CODES } from "../utils/ServiceError";
import type { PlanReassignPayload, PlanBlockPayload } from "../types/CalibrationPlanPayload";

const requireNonEmptyString = (value: unknown, code: keyof typeof ERROR_CODES): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ServiceError(code, 422);
  }
  return value.trim();
};

const requirePositiveInt = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new ServiceError(ERROR_CODES.VALIDATION_FAILED, 422, { field: "target_vendor_id" });
  }
  return value;
};

const requireVersion = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new ServiceError(ERROR_CODES.VALIDATION_FAILED, 422, { field: "expected_version" });
  }
  return value;
};

export const parseReassignPayload = (body: Record<string, unknown>): PlanReassignPayload => ({
  target_vendor_id: requirePositiveInt(body.target_vendor_id),
  handled_by: requireNonEmptyString(body.handled_by, ERROR_CODES.HANDLER_REQUIRED),
  reason: requireNonEmptyString(body.reason, ERROR_CODES.REASON_REQUIRED),
  expected_version: requireVersion(body.expected_version)
});

export const parseBlockPayload = (body: Record<string, unknown>): PlanBlockPayload => ({
  handled_by: requireNonEmptyString(body.handled_by, ERROR_CODES.HANDLER_REQUIRED),
  reason: requireNonEmptyString(body.reason, ERROR_CODES.REASON_REQUIRED),
  block_reason: requireNonEmptyString(body.block_reason ?? body.reason, ERROR_CODES.REASON_REQUIRED),
  expected_version: requireVersion(body.expected_version)
});
