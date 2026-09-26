import type { MeasuringDevice } from "../models/MeasuringDevice";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { CalibrationCertificate } from "../models/CalibrationCertificate";
import type { PlanChangeRecord } from "../models/PlanChangeRecord";
import { toPlanChangeRecordDto } from "./PlanChangeRecordDtoFactory";

export interface DeviceCalibrationHistory {
  device: MeasuringDevice;
  plans: CalibrationPlan[];
  certificates: CalibrationCertificate[];
  change_records: ReturnType<typeof toPlanChangeRecordDto>[];
}

/** 设备校准链路详情：设备台账 + 计划 + 证书 + 暂停处置变更 */
export const toDeviceCalibrationHistoryDto = (
  device: MeasuringDevice,
  plans: CalibrationPlan[],
  certificates: CalibrationCertificate[],
  changeRecords: PlanChangeRecord[]
): DeviceCalibrationHistory => ({
  device,
  plans,
  certificates,
  change_records: changeRecords.map(toPlanChangeRecordDto)
});
