import type { PlanChangeRecord } from "../models/PlanChangeRecord";
import { PLAN_CHANGE_TYPE_LABEL } from "../constants/PlanChangeType";
import { formatPlanStatus, formatVendorStatus, formatDateTime } from "../utils/formatters";

export const createPlanChangeRecordDto = (overrides: Partial<PlanChangeRecord> = {}) => ({
  id: 1,
  plan_id: 1,
  device_id: 1,
  change_type: "REASSIGNED",
  previous_vendor_id: 6,
  new_vendor_id: 1,
  previous_status: "ASSIGNED",
  new_status: "ASSIGNED",
  reason: "原机构资质暂停，转派",
  handled_by: "dispatcher.zhao",
  handled_at: "2026-09-26T01:00:00Z",
  ...overrides
});

/** 变更记录响应：附状态/机构的中文文案，供设备详情和计划变更时间线展示 */
export const toPlanChangeRecordDto = (record: PlanChangeRecord) => ({
  ...record,
  change_type_text: PLAN_CHANGE_TYPE_LABEL[record.change_type],
  previous_status_text: formatPlanStatus(record.previous_status),
  new_status_text: formatPlanStatus(record.new_status),
  previous_vendor_status_text:
    record.previous_vendor_id === null ? "未派发" : formatVendorStatus("SUSPENDED"),
  handled_at_text: formatDateTime(record.handled_at)
});
