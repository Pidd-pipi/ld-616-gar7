export const PlanChangeType = {
  VENDOR_SUSPENDED: "VENDOR_SUSPENDED",
  REASSIGNED: "REASSIGNED",
  BLOCKED_UNASSIGNED: "BLOCKED_UNASSIGNED"
} as const;
export type PlanChangeType = (typeof PlanChangeType)[keyof typeof PlanChangeType];

export const PLAN_CHANGE_TYPE_LABEL: Record<PlanChangeType, string> = {
  VENDOR_SUSPENDED: "机构资质暂停",
  REASSIGNED: "计划转派其他机构",
  BLOCKED_UNASSIGNED: "无人可接退回未派发"
};
