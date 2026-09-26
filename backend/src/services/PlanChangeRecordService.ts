import { planChangeRecordRepository } from "../repositories/PlanChangeRecordRepository";
import { toPlanChangeRecordDto } from "../constructors/PlanChangeRecordDtoFactory";
import type { PlanChangeRecord } from "../models/PlanChangeRecord";
import type { PlanChangeRecordPayload } from "../types/PlanChangeRecordPayload";

export const planChangeRecordService = {
  record: (payload: PlanChangeRecordPayload): PlanChangeRecord =>
    planChangeRecordRepository.save(payload),

  listByPlan: (planId: number) =>
    planChangeRecordRepository.findByPlan(planId).map(toPlanChangeRecordDto),

  listByDevice: (deviceId: number) =>
    planChangeRecordRepository.findByDevice(deviceId).map(toPlanChangeRecordDto),

  findRecordsByDevice: (deviceId: number): PlanChangeRecord[] =>
    planChangeRecordRepository.findByDevice(deviceId),

  /** 暂停处置是否已落地（转派 / 退回未派发），用于两人同时处理时的单次落地判定 */
  findHandlingByPlan: (planId: number) =>
    planChangeRecordRepository.findHandlingByPlan(planId)
};
