import { seed } from "../seed";
import type { MeasuringDevice } from "../models/MeasuringDevice";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { CalibrationCertificate } from "../models/CalibrationCertificate";
import type { CalibrationVendor } from "../models/CalibrationVendor";
import type { OverdueAlert } from "../models/OverdueAlert";
import type { PlanChangeRecord } from "../models/PlanChangeRecord";

// 进程内可变存储：seed 深拷贝一份作为起点，写操作落在这里
const clone = <T>(rows: readonly T[]): T[] => rows.map((row) => ({ ...(row as object) }) as T);

export const store: {
  measuringDevice: MeasuringDevice[];
  calibrationPlan: CalibrationPlan[];
  calibrationCertificate: CalibrationCertificate[];
  calibrationVendor: CalibrationVendor[];
  overdueAlert: OverdueAlert[];
  planChangeRecord: PlanChangeRecord[];
} = {
  measuringDevice: clone(seed.measuringDevice),
  calibrationPlan: clone(seed.calibrationPlan) as CalibrationPlan[],
  calibrationCertificate: clone(seed.calibrationCertificate),
  calibrationVendor: clone(seed.calibrationVendor),
  overdueAlert: clone(seed.overdueAlert),
  planChangeRecord: []
};
