export const PlanStatus = {
  PLANNED: "PLANNED",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  CERT_UPLOADED: "CERT_UPLOADED",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED"
} as const;
export type PlanStatus = (typeof PlanStatus)[keyof typeof PlanStatus];
