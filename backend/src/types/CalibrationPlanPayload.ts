export type CalibrationPlanPayload = Record<string, unknown>;

export interface PlanReassignPayload {
  target_vendor_id: number;
  handled_by: string;
  reason: string;
  expected_version: number;
}

export interface PlanBlockPayload {
  handled_by: string;
  reason: string;
  block_reason: string;
  expected_version: number;
}

export interface PendingSuspensionQuery {
  vendor_id: number;
}
