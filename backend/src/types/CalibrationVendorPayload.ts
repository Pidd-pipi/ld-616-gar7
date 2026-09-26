export type CalibrationVendorPayload = Record<string, unknown>;

export interface VendorSuspendPayload {
  reason: string;
  handled_by: string;
}
