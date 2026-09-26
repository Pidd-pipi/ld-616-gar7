import { dataStore } from "./dataStore";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import { PlanStatus } from "../constants/PlanStatus";

const NOT_STARTED_STATUSES: string[] = [PlanStatus.PLANNED, PlanStatus.ASSIGNED];

export const calibrationPlanRepository = {
  findAll: (): CalibrationPlan[] => dataStore.calibrationPlan,

  findById: (id: number): CalibrationPlan | undefined =>
    dataStore.calibrationPlan.find((plan) => plan.id === id),

  /** 暂停处置专用：某机构名下尚未开始执行（未派发/已派发）的计划 */
  findPendingByVendor: (vendorId: number): CalibrationPlan[] =>
    dataStore.calibrationPlan.filter(
      (plan) =>
        plan.assigned_vendor_id === vendorId && NOT_STARTED_STATUSES.includes(plan.status)
    ),

  findByDevice: (deviceId: number): CalibrationPlan[] =>
    dataStore.calibrationPlan
      .filter((plan) => plan.device_id === deviceId)
      .sort((a, b) => b.planned_date.localeCompare(a.planned_date)),

  save: (row: unknown): unknown => {
    const created = row as CalibrationPlan;
    created.id = dataStore.calibrationPlan.length
      ? Math.max(...dataStore.calibrationPlan.map((item) => item.id)) + 1
      : 1;
    created.version = 1;
    dataStore.calibrationPlan.push(created);
    return created;
  }
};
