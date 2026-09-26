import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { planChangeRecordService } from "./PlanChangeRecordService";
import { toCalibrationPlanDto } from "../constructors/CalibrationPlanDtoFactory";
import { toPendingSuspensionItemDto } from "../constructors/PendingSuspensionItemDtoFactory";
import {
  parseReassignPayload,
  parseBlockPayload
} from "../validators/calibrationPlanSuspensionValidator";
import { ServiceError, ERROR_CODES, notFound, conflict, unprocessable } from "../utils/ServiceError";
import { withPlanLock } from "../utils/planLock";
import { scopeCoversDevice } from "../utils/serviceScope";
import { writeOperationLog, type OperationActor } from "../utils/operationLogger";
import { PlanStatus } from "../constants/PlanStatus";
import { VendorStatus } from "../constants/VendorStatus";
import { PlanChangeType } from "../constants/PlanChangeType";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { PlanReassignPayload, PlanBlockPayload } from "../types/CalibrationPlanPayload";

const NOT_STARTED_STATUSES: string[] = [PlanStatus.PLANNED, PlanStatus.ASSIGNED];

const nowIso = (): string => new Date().toISOString();

const markHandling = (
  plan: CalibrationPlan,
  handling: PlanChangeType,
  handledBy: string,
  reason: string,
  blockReason: string | null
): void => {
  if (plan.original_vendor_id === null && plan.assigned_vendor_id !== null) {
    plan.original_vendor_id = plan.assigned_vendor_id;
  }
  plan.last_suspension_handling = handling;
  plan.suspension_handled_by = handledBy;
  plan.suspension_reason = reason;
  plan.block_reason = blockReason;
  plan.version += 1;
};

/** 暂停处置的公共前置校验，必须在计划锁内执行，保证两人同时处理只落地一次 */
const loadPlanForSuspensionHandling = (
  planId: number,
  expectedVersion: number
): { plan: CalibrationPlan } => {
  const plan = calibrationPlanRepository.findById(planId);
  if (!plan) {
    throw notFound(ERROR_CODES.PLAN_NOT_FOUND);
  }
  // 已经开始执行的计划继续走原流程，不在暂停处置范围
  if (!NOT_STARTED_STATUSES.includes(plan.status as PlanStatus)) {
    throw unprocessable(ERROR_CODES.PLAN_NOT_STARTED_REQUIRED);
  }
  if (plan.assigned_vendor_id === null) {
    throw unprocessable(ERROR_CODES.PLAN_ASSIGNED_VENDOR_REQUIRED);
  }
  // 先看是否已被另一人落地：可能原机构已换走，否则只会得到含糊的机构状态错误
  if (planChangeRecordService.findHandlingByPlan(plan.id)) {
    throw conflict(ERROR_CODES.PLAN_ALREADY_HANDLED);
  }
  const suspendedVendor = calibrationVendorRepository.findById(plan.assigned_vendor_id);
  if (!suspendedVendor || suspendedVendor.vendor_status !== VendorStatus.SUSPENDED) {
    throw unprocessable(ERROR_CODES.VENDOR_NOT_SUSPENDED);
  }
  // 乐观锁：另一人已落地后，旧版本提交直接冲突
  if (plan.version !== expectedVersion) {
    throw conflict(ERROR_CODES.PLAN_VERSION_CONFLICT);
  }
  return { plan };
};

export const calibrationPlanService = {
  list: () => calibrationPlanRepository.findAll().map(toCalibrationPlanDto),

  create: (row: unknown) => calibrationPlanRepository.save(row),

  /** 暂停处置入口：列出某暂停机构名下所有未开始（未派发/已派发）的计划及可承接机构 */
  listPendingSuspension: (vendorId: number) => {
    const vendor = calibrationVendorRepository.findById(vendorId);
    if (!vendor) {
      throw notFound(ERROR_CODES.VENDOR_NOT_FOUND);
    }
    if (vendor.vendor_status !== VendorStatus.SUSPENDED) {
      throw unprocessable(ERROR_CODES.VENDOR_NOT_SUSPENDED);
    }
    return calibrationPlanRepository
      .findPendingByVendor(vendorId)
      .flatMap((plan) => {
        const device = measuringDeviceRepository.findById(plan.device_id);
        if (!device) {
          return [];
        }
        const eligibleVendors = calibrationVendorRepository.findEligibleForDevice(
          device.device_type,
          vendorId
        );
        return [toPendingSuspensionItemDto(plan, device, vendor, eligibleVendors)];
      });
  },

  /** 转派：设备与日期不变，仅更换为资质有效且服务范围匹配的机构；原机构/处理人/原因留在计划里 */
  reassign: (planId: number, rawBody: Record<string, unknown>, actor: OperationActor) => {
    const payload: PlanReassignPayload = parseReassignPayload(rawBody);
    return withPlanLock(planId, () => {
      const { plan } = loadPlanForSuspensionHandling(planId, payload.expected_version);
      const previousVendorId = plan.assigned_vendor_id as number;
      const previousStatus = plan.status;

      const targetVendor = calibrationVendorRepository.findById(payload.target_vendor_id);
      if (!targetVendor) {
        throw notFound(ERROR_CODES.VENDOR_NOT_FOUND);
      }
      if (targetVendor.vendor_status !== VendorStatus.ACTIVE) {
        throw unprocessable(ERROR_CODES.TARGET_VENDOR_INACTIVE);
      }
      const device = measuringDeviceRepository.findById(plan.device_id);
      if (!device) {
        throw notFound(ERROR_CODES.DEVICE_NOT_FOUND);
      }
      if (!scopeCoversDevice(targetVendor.service_scope, device.device_type)) {
        throw unprocessable(ERROR_CODES.SERVICE_SCOPE_MISMATCH);
      }

      markHandling(plan, PlanChangeType.REASSIGNED, payload.handled_by, payload.reason, null);
      // 设备（device_id）与日期（planned_date）保持不变，仅切换承接机构
      plan.assigned_vendor_id = targetVendor.id;
      plan.status = PlanStatus.ASSIGNED;

      const record = planChangeRecordService.record({
        plan_id: plan.id,
        device_id: plan.device_id,
        change_type: PlanChangeType.REASSIGNED,
        previous_vendor_id: previousVendorId,
        new_vendor_id: targetVendor.id,
        previous_status: previousStatus,
        new_status: plan.status,
        reason: payload.reason,
        handled_by: payload.handled_by,
        handled_at: nowIso()
      });

      writeOperationLog("CalibrationPlan", "reassign", actor, plan.id, {
        plan_id: plan.id,
        previous_vendor_id: previousVendorId,
        new_vendor_id: targetVendor.id,
        handled_by: payload.handled_by,
        device_id: plan.device_id,
        planned_date: plan.planned_date
      });

      return {
        plan: toCalibrationPlanDto(plan),
        change_record: record,
        eligible_vendors: calibrationVendorRepository
          .findEligibleForDevice(device.device_type, previousVendorId)
          .map((vendor) => ({ id: vendor.id, vendor_name: vendor.vendor_name }))
      };
    });
  },

  /** 无人可接：退回未派发（PLANNED）并写明阻塞原因；若仍有可接机构则拒绝退回 */
  blockUnassigned: (planId: number, rawBody: Record<string, unknown>, actor: OperationActor) => {
    const payload: PlanBlockPayload = parseBlockPayload(rawBody);
    return withPlanLock(planId, () => {
      const { plan } = loadPlanForSuspensionHandling(planId, payload.expected_version);
      const previousVendorId = plan.assigned_vendor_id as number;
      const previousStatus = plan.status;

      const device = measuringDeviceRepository.findById(plan.device_id);
      if (!device) {
        throw notFound(ERROR_CODES.DEVICE_NOT_FOUND);
      }
      const eligibleVendors = calibrationVendorRepository.findEligibleForDevice(
        device.device_type,
        previousVendorId
      );
      if (eligibleVendors.length > 0) {
        throw new ServiceError(ERROR_CODES.ELIGIBLE_VENDOR_EXISTS, 422, {
          eligible_vendor_ids: eligibleVendors.map((vendor) => vendor.id)
        });
      }

      markHandling(
        plan,
        PlanChangeType.BLOCKED_UNASSIGNED,
        payload.handled_by,
        payload.reason,
        payload.block_reason
      );
      // 设备与日期不变，机构清空，回到未派发池等待后续重新派发
      plan.assigned_vendor_id = null;
      plan.status = PlanStatus.PLANNED;

      const record = planChangeRecordService.record({
        plan_id: plan.id,
        device_id: plan.device_id,
        change_type: PlanChangeType.BLOCKED_UNASSIGNED,
        previous_vendor_id: previousVendorId,
        new_vendor_id: null,
        previous_status: previousStatus,
        new_status: plan.status,
        reason: payload.block_reason,
        handled_by: payload.handled_by,
        handled_at: nowIso()
      });

      writeOperationLog("CalibrationPlan", "blockUnassigned", actor, plan.id, {
        plan_id: plan.id,
        previous_vendor_id: previousVendorId,
        block_reason: payload.block_reason,
        handled_by: payload.handled_by,
        device_id: plan.device_id,
        planned_date: plan.planned_date
      });

      return { plan: toCalibrationPlanDto(plan), change_record: record, eligible_vendors: [] };
    });
  }
};
