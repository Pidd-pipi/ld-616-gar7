import type { PlanStatus } from "../constants/PlanStatus";

export type CalibrationPlanPayload = Record<string, unknown>;

// 调度员把一笔暂停机构名下的计划改派给资质有效且服务范围匹配的机构
export interface ReassignPlanPayload {
  target_vendor_id: number;
  reason: string;
  expected_version: number;
  handled_by?: string;
  handled_by_name?: string;
}

// 无人能接：回到未派发（PLANNED），并写明阻塞原因
export interface ReleaseBlockedPlanPayload {
  blocked_reason: string;
  expected_version: number;
  handled_by?: string;
  handled_by_name?: string;
}

export interface CalibrationPlanTransition {
  status: PlanStatus;
  assigned_vendor_id: number | null;
}
