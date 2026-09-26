export interface CalibrationVendor {
  id: number;
  vendor_name: string;
  qualification_no: string;
  contact_phone: string;
  service_scope: string;
  vendor_status: string;
  suspend_reason: string | null;
  suspended_at: string | null;
  suspended_by: string | null;
}
