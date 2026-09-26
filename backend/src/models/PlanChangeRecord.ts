import type { PlanChangeType } from "../constants/PlanChangeType";

// 暂停处置流水：设备详情可查每次改派/退回变更
export interface PlanChangeRecord {
  id: number;
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
