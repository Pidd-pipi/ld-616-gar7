import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { planChangeRecordService } from "./PlanChangeRecordService";
import { toCalibrationVendorDto } from "../constructors/CalibrationVendorDtoFactory";
import { parseVendorSuspendPayload } from "../validators/calibrationVendorValidator";
import { ERROR_CODES, notFound, unprocessable } from "../utils/ServiceError";
import { writeOperationLog, type OperationActor } from "../utils/operationLogger";
import { VendorStatus } from "../constants/VendorStatus";
import { PlanStatus } from "../constants/PlanStatus";
import { PlanChangeType } from "../constants/PlanChangeType";

const nowIso = (): string => new Date().toISOString();

export const calibrationVendorService = {
  list: () => calibrationVendorRepository.findAll().map(toCalibrationVendorDto),

  create: (row: unknown) => calibrationVendorRepository.save(row),

  /** 资质有效且服务范围匹配某设备类型的候选机构 */
  listEligibleCandidates: (deviceType: string, excludeVendorId?: number) =>
    calibrationVendorRepository
      .findEligibleForDevice(deviceType, excludeVendorId)
      .map(toCalibrationVendorDto),

  /**
   * 暂停机构资质：只改机构状态并给名下未开始计划打暂停标记；
   * 计划本身不自动改派，由调度员逐笔转派或退回未派发。
   * 已经开始执行的计划保持原流程。
   */
  suspend: (vendorId: number, rawBody: Record<string, unknown>, actor: OperationActor) => {
    const payload = parseVendorSuspendPayload(rawBody);
    const vendor = calibrationVendorRepository.findById(vendorId);
    if (!vendor) {
      throw notFound(ERROR_CODES.VENDOR_NOT_FOUND);
    }
    if (vendor.vendor_status === VendorStatus.SUSPENDED) {
      throw unprocessable(ERROR_CODES.VENDOR_ALREADY_SUSPENDED);
    }

    vendor.vendor_status = VendorStatus.SUSPENDED;
    vendor.suspend_reason = payload.reason;
    vendor.suspended_at = nowIso();
    vendor.suspended_by = payload.handled_by;

    const affectedPlans = calibrationPlanRepository.findPendingByVendor(vendorId);
    for (const plan of affectedPlans) {
      // 仅留痕标记，计划状态/机构/设备/日期均不变，等待调度员处置
      if (plan.original_vendor_id === null) {
        plan.original_vendor_id = plan.assigned_vendor_id;
      }
      plan.suspension_reason = payload.reason;
      plan.version += 1;
      planChangeRecordService.record({
        plan_id: plan.id,
        device_id: plan.device_id,
        change_type: PlanChangeType.VENDOR_SUSPENDED,
        previous_vendor_id: vendor.id,
        new_vendor_id: vendor.id,
        previous_status: plan.status,
        new_status: plan.status,
        reason: payload.reason,
        handled_by: payload.handled_by,
        handled_at: nowIso()
      });
    }

    writeOperationLog("CalibrationVendor", "suspend", actor, vendor.id, {
      vendor_id: vendor.id,
      qualification_no: vendor.qualification_no,
      affected_plan_ids: affectedPlans.map((plan) => plan.id),
      in_progress_untouched: calibrationPlanRepository
        .findAll()
        .filter(
          (plan) =>
            plan.assigned_vendor_id === vendorId &&
            plan.status === PlanStatus.IN_PROGRESS
        )
        .map((plan) => plan.id),
      handled_by: payload.handled_by
    });

    return {
      vendor: toCalibrationVendorDto(vendor),
      affected_plan_ids: affectedPlans.map((plan) => plan.id),
      // 供调度员直接进入处置列表
      pending_handling: affectedPlans.map((plan) => {
        const device = measuringDeviceRepository.findById(plan.device_id);
        const eligible = device
          ? calibrationVendorRepository.findEligibleForDevice(device.device_type, vendorId)
          : [];
        return {
          plan_id: plan.id,
          device_id: plan.device_id,
          planned_date: plan.planned_date,
          status: plan.status,
          version: plan.version,
          eligible_vendor_ids: eligible.map((candidate) => candidate.id)
        };
      })
    };
  }
};
