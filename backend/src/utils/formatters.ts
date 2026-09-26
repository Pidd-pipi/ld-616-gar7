import { PlanStatus } from "../constants/PlanStatus";
import { VendorStatus } from "../constants/VendorStatus";
import { PlanChangeType, PLAN_CHANGE_TYPE_LABEL } from "../constants/PlanChangeType";

export const toAuditTarget = (type: string, id: string | number) => `${type}#${id}`;

export const PLAN_STATUS_LABEL: Record<string, string> = {
  PLANNED: "未派发",
  ASSIGNED: "已派发",
  IN_PROGRESS: "执行中",
  CERT_UPLOADED: "证书已上传",
  CLOSED: "已关闭",
  CANCELLED: "已取消"
};

export const formatPlanStatus = (status: string): string =>
  (Object.values(PlanStatus) as string[]).includes(status)
    ? PLAN_STATUS_LABEL[status]
    : status;

export const VENDOR_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "资质有效",
  SUSPENDED: "资质暂停",
  REVOKED: "资质撤销"
};

export const formatVendorStatus = (status: string): string =>
  (Object.values(VendorStatus) as string[]).includes(status)
    ? VENDOR_STATUS_LABEL[status]
    : status;

export const formatPlanChangeType = (changeType: string): string =>
  (Object.values(PlanChangeType) as string[]).includes(changeType)
    ? PLAN_CHANGE_TYPE_LABEL[changeType as PlanChangeType]
    : changeType;

export const formatDateTime = (value: string | null): string =>
  value ? value.replace("T", " ").replace("Z", " UTC") : "—";
