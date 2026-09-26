export const PlanStatus = ["PLANNED","ASSIGNED","IN_PROGRESS","CERT_UPLOADED","CLOSED","CANCELLED"] as const;
export type PlanStatus = (typeof PlanStatus)[number];

// 机构资质暂停处置：只有「未开始」的计划允许调度员改派或退回未派发
export const UNSTARTED_PLAN_STATUSES = ["PLANNED", "ASSIGNED"] as const;
// 已经开始执行的计划继续走原流程，不允许改派/退回
export const STARTED_PLAN_STATUSES = ["IN_PROGRESS", "CERT_UPLOADED", "CLOSED"] as const;
