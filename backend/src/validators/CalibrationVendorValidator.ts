import type { SuspendVendorPayload } from "../types/CalibrationVendorPayload";

const isNonBlank = (value: unknown): boolean => typeof value === "string" && value.trim().length > 0;

// 暂停机构入参：原因为可选记录项
export const validateSuspendVendorPayload = (body: any = {}): SuspendVendorPayload => ({
  reason: isNonBlank(body.reason) ? String(body.reason).trim() : undefined,
  handled_by: isNonBlank(body.handled_by) ? String(body.handled_by).trim() : undefined,
  handled_by_name: isNonBlank(body.handled_by_name) ? String(body.handled_by_name).trim() : undefined
});

export const parseVendorId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("vendor id must be a positive integer");
  }
  return id;
};
