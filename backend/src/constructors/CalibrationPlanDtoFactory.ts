import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { ReassignPlanPayload, ReleaseBlockedPlanPayload } from "../types/CalibrationPlanPayload";

export const createCalibrationPlanDto = (
  overrides: Partial<CalibrationPlan> = {}
): CalibrationPlan => ({
  id: 1,
  device_id: 1,
  planned_date: "2026-06-11T09:00:00Z",
  plan_type: "PERIODIC",
  priority: "MEDIUM",
  status: "PLANNED",
  assigned_vendor_id: 1,
  created_by: "created by 1",
  original_vendor_id: null,
  handled_by: null,
  handled_reason: null,
  blocked_reason: null,
  handled_at: null,
  version: 0,
  ...overrides
});

// 暂停机构处置清单中的单条计划（带设备详情，设备与日期不可变，仅随响应展示）
export const createTriagePlanDto = (plan: CalibrationPlan, overrides: Record<string, unknown> = {}) => ({
  id: plan.id,
  device_id: plan.device_id,
  planned_date: plan.planned_date,
  plan_type: plan.plan_type,
  priority: plan.priority,
  status: plan.status,
  assigned_vendor_id: plan.assigned_vendor_id,
  original_vendor_id: plan.original_vendor_id,
  handled_by: plan.handled_by,
  handled_reason: plan.handled_reason,
  blocked_reason: plan.blocked_reason,
  handled_at: plan.handled_at,
  version: plan.version,
  ...overrides
});

export const createReassignPlanPayloadDto = (overrides: Partial<ReassignPlanPayload> = {}): ReassignPlanPayload => ({
  target_vendor_id: 1,
  reason: "原校准机构资质暂停，改派至资质有效机构",
  expected_version: 0,
  ...overrides
});

export const createReleaseBlockedPlanPayloadDto = (
  overrides: Partial<ReleaseBlockedPlanPayload> = {}
): ReleaseBlockedPlanPayload => ({
  blocked_reason: "当前无资质有效且服务范围匹配的机构可承接",
  expected_version: 0,
  ...overrides
});
