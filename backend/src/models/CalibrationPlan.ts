export interface CalibrationPlan {
  id: number;
  device_id: number;
  planned_date: string;
  plan_type: string;
  priority: string;
  status: string;
  assigned_vendor_id: number | null;
  original_vendor_id: number | null;
  last_suspension_handling: string | null;
  suspension_handled_by: string | null;
  suspension_reason: string | null;
  block_reason: string | null;
  version: number;
  created_by: string;
}
