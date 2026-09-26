import { store } from "./store";
import type { PlanChangeRecord } from "../models/PlanChangeRecord";
import { buildPlanChangeRecord } from "../constructors/PlanChangeRecordDtoFactory";
import type { CreatePlanChangeRecordPayload } from "../types/PlanChangeRecordPayload";

export const planChangeRecordRepository = {
  findAll: (): PlanChangeRecord[] => store.planChangeRecord,
  findByDevice: (deviceId: number): PlanChangeRecord[] =>
    store.planChangeRecord
      .filter((row) => row.device_id === deviceId)
      .sort((a, b) => (a.handled_at < b.handled_at ? 1 : -1)),
  findByPlan: (planId: number): PlanChangeRecord[] =>
    store.planChangeRecord
      .filter((row) => row.plan_id === planId)
      .sort((a, b) => (a.handled_at < b.handled_at ? 1 : -1)),
  create: (payload: CreatePlanChangeRecordPayload): PlanChangeRecord => {
    const id = store.planChangeRecord.reduce((max, row) => Math.max(max, row.id), 0) + 1;
    const record = buildPlanChangeRecord(id, payload);
    store.planChangeRecord.push(record);
    return record;
  }
};
