import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { planChangeRecordService } from "./PlanChangeRecordService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { notFoundError } from "../utils/httpErrors";

export const measuringDeviceService = {
  list: () => measuringDeviceRepository.findAll(),
  create: (row: unknown) => measuringDeviceRepository.save(row),

  // 设备详情：台账 + 校准计划（含暂停处置留痕字段）+ 暂停处置变更流水
  getDetail: (id: number) => {
    const device = measuringDeviceRepository.findById(id);
    if (!device) {
      throw notFoundError(ERROR_CODES.DEVICE_NOT_FOUND, ERROR_MESSAGES.DEVICE_NOT_FOUND(id));
    }
    return {
      device,
      plans: calibrationPlanRepository.findByDevice(id),
      changes: planChangeRecordService.listByDevice(id)
    };
  }
};
