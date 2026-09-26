import { dataStore, nextId } from "./dataStore";
import type { PlanChangeRecord } from "../models/PlanChangeRecord";
import type { PlanChangeRecordPayload } from "../types/PlanChangeRecordPayload";

export const planChangeRecordRepository = {
  findAll: (): PlanChangeRecord[] => dataStore.planChangeRecord,

  findByPlan: (planId: number): PlanChangeRecord[] =>
    dataStore.planChangeRecord
      .filter((record) => record.plan_id === planId)
      .sort((a, b) => b.handled_at.localeCompare(a.handled_at)),

  findByDevice: (deviceId: number): PlanChangeRecord[] =>
    dataStore.planChangeRecord
      .filter((record) => record.device_id === deviceId)
      .sort((a, b) => b.handled_at.localeCompare(a.handled_at)),

  /** 暂停处置落地记录：转派或退回未派发（暂停标记不算处置落地） */
  findHandlingByPlan: (planId: number): PlanChangeRecord | undefined =>
    dataStore.planChangeRecord.find(
      (record) =>
        record.plan_id === planId &&
        (record.change_type === "REASSIGNED" || record.change_type === "BLOCKED_UNASSIGNED")
    ),

  save: (payload: PlanChangeRecordPayload): PlanChangeRecord => {
    const created: PlanChangeRecord = { id: nextId(dataStore.planChangeRecord), ...payload };
    dataStore.planChangeRecord.push(created);
    return created;
  }
};
