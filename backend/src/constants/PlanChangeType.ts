// 暂停处置流水的变更类型：改派接单 / 无人接单退回未派发
export const PlanChangeType = ["REASSIGN", "RELEASE_BLOCKED"] as const;
export type PlanChangeType = (typeof PlanChangeType)[number];
