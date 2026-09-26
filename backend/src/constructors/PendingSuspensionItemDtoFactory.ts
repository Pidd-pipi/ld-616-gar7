import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { CalibrationVendor } from "../models/CalibrationVendor";
import type { MeasuringDevice } from "../models/MeasuringDevice";
import { createCalibrationPlanDto } from "./CalibrationPlanDtoFactory";

export interface PendingSuspensionItem {
  plan: CalibrationPlan;
  device: MeasuringDevice;
  suspended_vendor: CalibrationVendor;
  eligible_vendors: Pick<CalibrationVendor, "id" | "vendor_name" | "service_scope">[];
  eligible: boolean;
}

export const createPendingSuspensionItemDto = (
  overrides: Partial<PendingSuspensionItem> = {}
): PendingSuspensionItem => ({
  plan: createCalibrationPlanDto(),
  device: {
    id: 1,
    device_code: "DEV-TEMP-001",
    name: "恒温箱温度记录仪",
    device_type: "THERMAL",
    accuracy_level: "HIGH",
    owner_dept: "理化实验室",
    calibration_cycle_days: 365,
    status: "DUE_SOON"
  },
  suspended_vendor: {
    id: 6,
    vendor_name: "东方全项校准服务公司",
    qualification_no: "CNAS-L0006",
    contact_phone: "0571-88000006",
    service_scope: "THERMAL,PRESSURE,DIMENSION,ELECTRICAL,GAS",
    vendor_status: "SUSPENDED",
    suspend_reason: "资质暂停",
    suspended_at: "2026-09-25T03:30:00Z",
    suspended_by: "quality.chen"
  },
  eligible_vendors: [],
  eligible: false,
  ...overrides
});

/** 暂停处置列表项：计划 + 设备 + 暂停机构 + 可承接候选，候选为空表示只能退回未派发 */
export const toPendingSuspensionItemDto = (
  plan: CalibrationPlan,
  device: MeasuringDevice,
  suspendedVendor: CalibrationVendor,
  eligibleVendors: CalibrationVendor[]
): PendingSuspensionItem => ({
  plan: { ...plan },
  device,
  suspended_vendor: suspendedVendor,
  eligible_vendors: eligibleVendors.map((vendor) => ({
    id: vendor.id,
    vendor_name: vendor.vendor_name,
    service_scope: vendor.service_scope
  })),
  eligible: eligibleVendors.length > 0
});
