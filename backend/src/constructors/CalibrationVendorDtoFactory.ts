import type { CalibrationVendor } from "../models/CalibrationVendor";

export const createCalibrationVendorDto = (overrides: Partial<CalibrationVendor> = {}) => ({
  id: 1,
  vendor_name: "vendor name 1",
  qualification_no: "qualification no 1",
  contact_phone: "1380000001",
  service_scope: "THERMAL",
  vendor_status: "ACTIVE",
  suspend_reason: null,
  suspended_at: null,
  suspended_by: null,
  ...overrides
});

export const toCalibrationVendorDto = (vendor: CalibrationVendor): CalibrationVendor => ({ ...vendor });
