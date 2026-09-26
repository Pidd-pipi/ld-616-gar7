import type { PlanChangeType } from "../constants/PlanChangeType";

export type PlanChangeRecordPayload = Record<string, unknown>;

export interface CreatePlanChangeRecordPayload {
  plan_id: number;
  device_id: number;
  change_type: PlanChangeType;
  from_vendor_id: number | null;
  to_vendor_id: number | null;
  reason: string;
  handled_by: string;
  handled_at: string;
  version_before: number;
  version_after: number;
}
