import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { planChangeRecordRepository } from "../repositories/PlanChangeRecordRepository";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { UNSTARTED_PLAN_STATUSES } from "../constants/PlanStatus";
import { notFoundError, conflictError } from "../utils/httpErrors";
import { scopeCoversDeviceType } from "../utils/vendorService";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { CalibrationVendor } from "../models/CalibrationVendor";
import type { AuthUser } from "../types/AuthUser";
import type { ReassignPlanPayload, ReleaseBlockedPlanPayload } from "../types/CalibrationPlanPayload";

const nowIso = (): string => new Date().toISOString();

const resolveHandledBy = (payload: { handled_by?: string; handled_by_name?: string }, user: AuthUser): string =>
  payload.handled_by_name || payload.handled_by || user.name;

export const calibrationPlanService = {
  list: (): CalibrationPlan[] => calibrationPlanRepository.findAll(),

  getById: (id: number): CalibrationPlan => {
    const plan = calibrationPlanRepository.findById(id);
    if (!plan) {
      throw notFoundError(ERROR_CODES.PLAN_NOT_FOUND, ERROR_MESSAGES.PLAN_NOT_FOUND(id));
    }
    return plan;
  },

  create: (row: unknown) => calibrationPlanRepository.save(row),

  // 仅「未开始」（PLANNED/ASSIGNED）的计划需要暂停处置；已开始的继续走原流程
  isUnstarted: (plan: CalibrationPlan): boolean =>
    (UNSTARTED_PLAN_STATUSES as readonly string[]).includes(plan.status),

  // 资质有效且服务范围覆盖该计划设备类型的机构，调度员可逐笔选择
  findEligibleVendors: (plan: CalibrationPlan): CalibrationVendor[] => {
    const device = measuringDeviceRepository.findById(plan.device_id);
    return calibrationVendorRepository
      .findAll()
      .filter((vendor) => vendor.vendor_status === "ACTIVE")
      .filter((vendor) => (device ? scopeCoversDeviceType(vendor.service_scope, device.device_type) : true));
  },

  // 改派：目标机构必须资质有效且服务范围匹配；设备、日期不变；原机构/处理人/原因留在计划里
  reassign: (id: number, payload: ReassignPlanPayload, user: AuthUser): CalibrationPlan => {
    const plan = calibrationPlanService.getById(id);

    if (!calibrationPlanService.isUnstarted(plan)) {
      throw conflictError(ERROR_CODES.PLAN_NOT_UNSTARTED, ERROR_MESSAGES.PLAN_NOT_UNSTARTED(id));
    }
    // 乐观锁：两个调度员同时处理同一计划，第二笔按旧版本提交只能失败，落地只发生一次
    if (plan.version !== payload.expected_version) {
      throw conflictError(ERROR_CODES.PLAN_VERSION_CONFLICT, ERROR_MESSAGES.PLAN_VERSION_CONFLICT(id));
    }

    const targetVendor = calibrationVendorRepository.findById(payload.target_vendor_id);
    if (!targetVendor) {
      throw notFoundError(
        ERROR_CODES.VENDOR_NOT_FOUND,
        ERROR_MESSAGES.VENDOR_NOT_FOUND(payload.target_vendor_id)
      );
    }
    if (targetVendor.vendor_status !== "ACTIVE") {
      throw conflictError(
        ERROR_CODES.VENDOR_SUSPENDED,
        ERROR_MESSAGES.VENDOR_SUSPENDED(targetVendor.id)
      );
    }
    const device = measuringDeviceRepository.findById(plan.device_id);
    if (device && !scopeCoversDeviceType(targetVendor.service_scope, device.device_type)) {
      throw conflictError(
        ERROR_CODES.VENDOR_SCOPE_MISMATCH,
        ERROR_MESSAGES.VENDOR_SCOPE_MISMATCH(targetVendor.id, device.device_type)
      );
    }

    const fromVendorId = plan.assigned_vendor_id;
    const versionBefore = plan.version;
    const handledBy = resolveHandledBy(payload, user);
    const handledAt = nowIso();

    // 设备与日期不变：这里只允许状态、机构、处理痕迹相关字段落地
    plan.status = "ASSIGNED";
    plan.assigned_vendor_id = targetVendor.id;
    // 原机构保留在计划里（首次改派时固化，后续改派不覆盖）
    plan.original_vendor_id = plan.original_vendor_id ?? fromVendorId;
    plan.handled_by = handledBy;
    plan.handled_reason = payload.reason;
    plan.blocked_reason = null;
    plan.handled_at = handledAt;
    plan.version += 1;

    planChangeRecordRepository.create({
      plan_id: plan.id,
      device_id: plan.device_id,
      change_type: "REASSIGN",
      from_vendor_id: fromVendorId,
      to_vendor_id: targetVendor.id,
      reason: payload.reason,
      handled_by: handledBy,
      handled_at: handledAt,
      version_before: versionBefore,
      version_after: plan.version
    });

    console.info(LOG_TEMPLATES.CalibrationPlan[5], { planId: plan.id, by: handledBy, toVendor: targetVendor.id });
    return plan;
  },

  // 没人能接：回到未派发（PLANNED），写明阻塞原因；原机构与处理人留痕
  releaseBlocked: (id: number, payload: ReleaseBlockedPlanPayload, user: AuthUser): CalibrationPlan => {
    const plan = calibrationPlanService.getById(id);

    if (!calibrationPlanService.isUnstarted(plan)) {
      throw conflictError(ERROR_CODES.PLAN_NOT_UNSTARTED, ERROR_MESSAGES.PLAN_NOT_UNSTARTED(id));
    }
    if (plan.version !== payload.expected_version) {
      throw conflictError(ERROR_CODES.PLAN_VERSION_CONFLICT, ERROR_MESSAGES.PLAN_VERSION_CONFLICT(id));
    }

    const fromVendorId = plan.assigned_vendor_id;
    const versionBefore = plan.version;
    const handledBy = resolveHandledBy(payload, user);
    const handledAt = nowIso();

    plan.status = "PLANNED";
    plan.assigned_vendor_id = null;
    plan.original_vendor_id = plan.original_vendor_id ?? fromVendorId;
    plan.handled_by = handledBy;
    plan.handled_reason = payload.blocked_reason;
    plan.blocked_reason = payload.blocked_reason;
    plan.handled_at = handledAt;
    plan.version += 1;

    planChangeRecordRepository.create({
      plan_id: plan.id,
      device_id: plan.device_id,
      change_type: "RELEASE_BLOCKED",
      from_vendor_id: fromVendorId,
      to_vendor_id: null,
      reason: payload.blocked_reason,
      handled_by: handledBy,
      handled_at: handledAt,
      version_before: versionBefore,
      version_after: plan.version
    });

    console.info(LOG_TEMPLATES.CalibrationPlan[6], { planId: plan.id, by: handledBy });
    return plan;
  }
};
