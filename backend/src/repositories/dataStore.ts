import { seed } from "../seed";
import type { MeasuringDevice } from "../models/MeasuringDevice";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { CalibrationCertificate } from "../models/CalibrationCertificate";
import type { CalibrationVendor } from "../models/CalibrationVendor";
import type { OverdueAlert } from "../models/OverdueAlert";
import type { PlanChangeRecord } from "../models/PlanChangeRecord";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const dataStore = {
  measuringDevice: clone(seed.measuringDevice) as unknown as MeasuringDevice[],
  calibrationPlan: clone(seed.calibrationPlan) as unknown as CalibrationPlan[],
  calibrationCertificate: clone(seed.calibrationCertificate) as unknown as CalibrationCertificate[],
  calibrationVendor: clone(seed.calibrationVendor) as unknown as CalibrationVendor[],
  overdueAlert: clone(seed.overdueAlert) as unknown as OverdueAlert[],
  planChangeRecord: clone(seed.planChangeRecord) as unknown as PlanChangeRecord[]
};

export const nextId = (rows: { id: number }[]): number =>
  rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
