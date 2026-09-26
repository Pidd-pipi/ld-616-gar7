import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ERROR_CODES } from "../constants/errorCodes";
import { validationError } from "../utils/httpErrors";
import type { ReassignPlanPayload, ReleaseBlockedPlanPayload } from "../types/CalibrationPlanPayload";

const isPositiveInt = (value: unknown): boolean =>
  typeof value === "number" && Number.isInteger(value) && value > 0;
const isNonNegInt = (value: unknown): boolean =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;
const isNonBlank = (value: unknown): boolean => typeof value === "string" && value.trim().length > 0;

// 改派入参：目标机构 + 原因 + 乐观锁版本
export const validateReassignPlanPayload = (body: any): ReassignPlanPayload => {
  if (!isPositiveInt(body?.target_vendor_id)) {
    throw validationError("target_vendor_id must be a positive integer");
  }
  if (!isNonBlank(body?.reason)) {
    throw validationError(ERROR_MESSAGES.REASSIGN_REASON_REQUIRED, ERROR_CODES.REASSIGN_REASON_REQUIRED);
  }
  if (!isNonNegInt(body?.expected_version)) {
    throw validationError("expected_version must be a non-negative integer");
  }
  return {
    target_vendor_id: body.target_vendor_id,
    reason: String(body.reason).trim(),
    expected_version: body.expected_version,
    handled_by: isNonBlank(body.handled_by) ? String(body.handled_by).trim() : undefined,
    handled_by_name: isNonBlank(body.handled_by_name) ? String(body.handled_by_name).trim() : undefined
  };
};

// 退回未派发入参：阻塞原因 + 乐观锁版本
export const validateReleaseBlockedPlanPayload = (body: any): ReleaseBlockedPlanPayload => {
  if (!isNonBlank(body?.blocked_reason)) {
    throw validationError(ERROR_MESSAGES.BLOCKED_REASON_REQUIRED, ERROR_CODES.BLOCKED_REASON_REQUIRED);
  }
  if (!isNonNegInt(body?.expected_version)) {
    throw validationError("expected_version must be a non-negative integer");
  }
  return {
    blocked_reason: String(body.blocked_reason).trim(),
    expected_version: body.expected_version,
    handled_by: isNonBlank(body.handled_by) ? String(body.handled_by).trim() : undefined,
    handled_by_name: isNonBlank(body.handled_by_name) ? String(body.handled_by_name).trim() : undefined
  };
};

export const parsePlanId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw validationError("plan id must be a positive integer");
  }
  return id;
};
