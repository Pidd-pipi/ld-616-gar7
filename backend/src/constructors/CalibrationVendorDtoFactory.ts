import type { CalibrationVendor } from "../models/CalibrationVendor";

export const createCalibrationVendorDto = (
  overrides: Partial<CalibrationVendor> = {}
): CalibrationVendor => ({
  id: 1,
  vendor_name: "vendor name 1",
  qualification_no: "qualification no 1",
  contact_phone: "13800000001",
  service_scope: "DIMENSIONAL",
  vendor_status: "ACTIVE",
  ...overrides
});

// 暂停机构响应：附带该机构名下未开始计划，供调度员逐笔处置
export const createSuspendVendorResultDto = (vendor: CalibrationVendor, overrides: Record<string, unknown> = {}) => ({
  id: vendor.id,
  vendor_name: vendor.vendor_name,
  vendor_status: vendor.vendor_status,
  triage_plan_count: 0,
  ...overrides
});
