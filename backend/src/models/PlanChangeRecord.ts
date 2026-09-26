import type { PlanChangeType } from "../constants/PlanChangeType";

export interface PlanChangeRecord {
  id: number;
  plan_id: number;
  device_id: number;
  change_type: PlanChangeType;
  previous_vendor_id: number | null;
  new_vendor_id: number | null;
  previous_status: string;
  new_status: string;
  reason: string;
  handled_by: string;
  handled_at: string;
}
