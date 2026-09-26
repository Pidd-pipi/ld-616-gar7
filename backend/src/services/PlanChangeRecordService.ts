import { planChangeRecordRepository } from "../repositories/PlanChangeRecordRepository";
import { formatPlanChangeType, formatPlanChangeDescription } from "../utils/formatters";
import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import type { PlanChangeRecord } from "../models/PlanChangeRecord";

const decorate = (record: PlanChangeRecord) => {
  const fromVendor = record.from_vendor_id
    ? calibrationVendorRepository.findById(record.from_vendor_id)
    : undefined;
  const toVendor = record.to_vendor_id ? calibrationVendorRepository.findById(record.to_vendor_id) : undefined;
  return {
    ...record,
    change_type_text: formatPlanChangeType(record.change_type),
    description: formatPlanChangeDescription({
      changeType: record.change_type,
      fromVendorId: record.from_vendor_id,
      toVendorId: record.to_vendor_id,
      reason: record.reason,
      handledBy: record.handled_by
    }),
    from_vendor_name: fromVendor?.vendor_name ?? null,
    to_vendor_name: toVendor?.vendor_name ?? null
  };
};

export const planChangeRecordService = {
  list: () => planChangeRecordRepository.findAll().map(decorate),
  listByPlan: (planId: number) => planChangeRecordRepository.findByPlan(planId).map(decorate),
  listByDevice: (deviceId: number) => planChangeRecordRepository.findByDevice(deviceId).map(decorate)
};
