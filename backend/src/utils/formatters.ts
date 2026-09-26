export const toAuditTarget = (type: string, id: string | number) => `${type}#${id}`;

// 暂停处置流水的展示文案，设备详情页与处置清单共用
export const formatPlanChangeType = (changeType: string): string => {
  if (changeType === "REASSIGN") return "机构资质暂停-改派";
  if (changeType === "RELEASE_BLOCKED") return "无人接单-退回未派发";
  return changeType;
};

export const formatPlanChangeDescription = (params: {
  changeType: string;
  fromVendorId: number | null;
  toVendorId: number | null;
  reason: string;
  handledBy: string;
}): string => {
  if (params.changeType === "REASSIGN") {
    return `原机构#${params.fromVendorId ?? "-"}资质暂停，由 ${params.handledBy} 改派至机构#${params.toVendorId}，原因：${params.reason}`;
  }
  return `原机构#${params.fromVendorId ?? "-"}资质暂停，由 ${params.handledBy} 退回未派发，阻塞原因：${params.reason}`;
};

export const formatVendorStatus = (status: string): string =>
  status === "SUSPENDED" ? "资质暂停" : status === "ACTIVE" ? "资质有效" : status;
