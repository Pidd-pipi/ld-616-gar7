import type { PlanChangeRecord } from "../models/PlanChangeRecord";
import type { CreatePlanChangeRecordPayload } from "../types/PlanChangeRecordPayload";

export const createPlanChangeRecordDto = (
  overrides: Partial<PlanChangeRecord> = {}
): PlanChangeRecord => ({
  id: 1,
  plan_id: 1,
  device_id: 1,
  change_type: "REASSIGN",
  from_vendor_id: 1,
  to_vendor_id: 2,
  reason: "原校准机构资质暂停",
  handled_by: "dispatcher 1",
  handled_at: "2026-09-26T09:00:00Z",
  version_before: 0,
  version_after: 1,
  ...overrides
});

export const buildPlanChangeRecord = (
  id: number,
  payload: CreatePlanChangeRecordPayload
): PlanChangeRecord => createPlanChangeRecordDto({ id, ...payload });
