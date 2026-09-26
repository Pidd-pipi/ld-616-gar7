import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { notFoundError, conflictError } from "../utils/httpErrors";
import { calibrationPlanService } from "./CalibrationPlanService";
import { createTriagePlanDto } from "../constructors/CalibrationPlanDtoFactory";
import { createSuspendVendorResultDto } from "../constructors/CalibrationVendorDtoFactory";
import { scopeCoversDeviceType } from "../utils/vendorService";
import type { CalibrationVendor } from "../models/CalibrationVendor";
import type { AuthUser } from "../types/AuthUser";
import type { SuspendVendorPayload } from "../types/CalibrationVendorPayload";

export const calibrationVendorService = {
  list: (): CalibrationVendor[] => calibrationVendorRepository.findAll(),

  getById: (id: number): CalibrationVendor => {
    const vendor = calibrationVendorRepository.findById(id);
    if (!vendor) {
      throw notFoundError(ERROR_CODES.VENDOR_NOT_FOUND, ERROR_MESSAGES.VENDOR_NOT_FOUND(id));
    }
    return vendor;
  },

  create: (row: unknown) => calibrationVendorRepository.save(row),

  // 暂停资质：未来计划不自动取消、不自动改派，保留在该机构名下等待调度员逐笔处置
  suspend: (id: number, payload: SuspendVendorPayload, user: AuthUser) => {
    const vendor = calibrationVendorService.getById(id);
    const handledBy = payload.handled_by_name || payload.handled_by || user.name;

    vendor.vendor_status = "SUSPENDED";

    const affectedPlans = calibrationVendorService.listUnstartedPlans(id);
    console.info(LOG_TEMPLATES.CalibrationVendor[4], {
      vendorId: vendor.id,
      by: handledBy,
      reason: payload.reason ?? "",
      affected: affectedPlans.length
    });

    return createSuspendVendorResultDto(vendor, { triage_plan_count: affectedPlans.length });
  },

  // 列出该暂停机构名下所有「未开始」计划；已开始执行的不在处置清单内
  listUnstartedPlans: (vendorId: number) => {
    const vendor = calibrationVendorService.getById(vendorId);
    if (vendor.vendor_status !== "SUSPENDED") {
      throw conflictError(
        ERROR_CODES.VENDOR_NOT_SUSPENDED,
        ERROR_MESSAGES.VENDOR_NOT_SUSPENDED(vendorId)
      );
    }

    return calibrationPlanRepository
      .findByAssignedVendor(vendorId)
      .filter((plan) => calibrationPlanService.isUnstarted(plan))
      .map((plan) => {
        const device = measuringDeviceRepository.findById(plan.device_id);
        // 每笔计划附上设备详情（设备不可改派、不可换期）与当前可承接机构候选
        const eligibleVendors = calibrationVendorRepository
          .findAll()
          .filter((candidate) => candidate.vendor_status === "ACTIVE")
          .filter((candidate) =>
            device ? scopeCoversDeviceType(candidate.service_scope, device.device_type) : true
          )
          .map((candidate) => ({ id: candidate.id, vendor_name: candidate.vendor_name }));
        return createTriagePlanDto(plan, {
          device: device ?? null,
          eligible_vendors: eligibleVendors
        });
      });
  }
};
