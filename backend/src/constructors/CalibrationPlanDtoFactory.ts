import type { CalibrationPlan } from "../models/CalibrationPlan";

export const createCalibrationPlanDto = (overrides: Partial<CalibrationPlan> = {}) => ({
  id: 1,
  device_id: 1,
  planned_date: "2026-10-15T02:00:00Z",
  plan_type: "PERIODIC",
  priority: "MEDIUM",
  status: "PLANNED",
  assigned_vendor_id: null,
  original_vendor_id: null,
  last_suspension_handling: null,
  suspension_handled_by: null,
  suspension_reason: null,
  block_reason: null,
  version: 1,
  created_by: "planner.li",
  ...overrides
});

/** 计划响应：带上内部 version 供调度员乐观锁提交 */
export const toCalibrationPlanDto = (plan: CalibrationPlan): CalibrationPlan => ({ ...plan });
