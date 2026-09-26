import { store } from "./store";
import type { CalibrationPlan } from "../models/CalibrationPlan";

export const calibrationPlanRepository = {
  findAll: (): CalibrationPlan[] => store.calibrationPlan,
  findById: (id: number): CalibrationPlan | undefined => store.calibrationPlan.find((row) => row.id === id),
  findByAssignedVendor: (vendorId: number): CalibrationPlan[] =>
    store.calibrationPlan.filter((row) => row.assigned_vendor_id === vendorId),
  findByDevice: (deviceId: number): CalibrationPlan[] =>
    store.calibrationPlan.filter((row) => row.device_id === deviceId),
  save: (row: unknown) => row,
  nextId: (): number => store.calibrationPlan.reduce((max, row) => Math.max(max, row.id), 0) + 1
};
