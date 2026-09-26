import { dataStore, nextId } from "./dataStore";
import type { CalibrationVendor } from "../models/CalibrationVendor";
import { VendorStatus } from "../constants/VendorStatus";

export const calibrationVendorRepository = {
  findAll: (): CalibrationVendor[] => dataStore.calibrationVendor,

  findById: (id: number): CalibrationVendor | undefined =>
    dataStore.calibrationVendor.find((vendor) => vendor.id === id),

  /** 暂停处置专用：资质有效且服务范围覆盖该设备类型的候选机构（排除当前承接机构） */
  findEligibleForDevice: (deviceType: string, excludeVendorId?: number): CalibrationVendor[] =>
    dataStore.calibrationVendor.filter((vendor) => {
      if (vendor.vendor_status !== VendorStatus.ACTIVE) {
        return false;
      }
      if (excludeVendorId !== undefined && vendor.id === excludeVendorId) {
        return false;
      }
      return vendor.service_scope
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .includes(deviceType.trim().toUpperCase());
    }),

  save: (row: unknown): unknown => {
    const created = row as CalibrationVendor;
    created.id = nextId(dataStore.calibrationVendor);
    created.vendor_status ??= VendorStatus.ACTIVE;
    created.suspend_reason ??= null;
    created.suspended_at ??= null;
    created.suspended_by ??= null;
    dataStore.calibrationVendor.push(created);
    return created;
  }
};
