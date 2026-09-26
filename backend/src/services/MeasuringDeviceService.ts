import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { calibrationCertificateRepository } from "../repositories/CalibrationCertificateRepository";
import { planChangeRecordService } from "./PlanChangeRecordService";
import { toDeviceCalibrationHistoryDto } from "../constructors/DeviceCalibrationHistoryDtoFactory";
import { ERROR_CODES, notFound } from "../utils/ServiceError";

export const measuringDeviceService = {
  list: () => measuringDeviceRepository.findAll(),

  create: (row: unknown) => measuringDeviceRepository.save(row),

  detail: (deviceId: number) => {
    const device = measuringDeviceRepository.findById(deviceId);
    if (!device) {
      throw notFound(ERROR_CODES.DEVICE_NOT_FOUND);
    }
    return device;
  },

  /** 设备校准链路：计划、证书之外，补充暂停处置的变更明细可查 */
  calibrationHistory: (deviceId: number) => {
    const device = measuringDeviceRepository.findById(deviceId);
    if (!device) {
      throw notFound(ERROR_CODES.DEVICE_NOT_FOUND);
    }
    return toDeviceCalibrationHistoryDto(
      device,
      calibrationPlanRepository.findByDevice(deviceId),
      calibrationCertificateRepository.findByDevice(deviceId),
      planChangeRecordService.findRecordsByDevice(deviceId)
    );
  }
};
