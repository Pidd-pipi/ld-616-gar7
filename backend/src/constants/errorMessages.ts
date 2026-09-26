export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  NOT_FOUND: "resource not found",
  PLAN_NOT_FOUND: (id: number | string) => `calibration plan #${id} not found`,
  VENDOR_NOT_FOUND: (id: number | string) => `calibration vendor #${id} not found`,
  DEVICE_NOT_FOUND: (id: number | string) => `measuring device #${id} not found`,
  VENDOR_NOT_SUSPENDED: (id: number | string) => `vendor #${id} is not suspended, triage list unavailable`,
  VENDOR_SUSPENDED: (id: number | string) => `vendor #${id} qualification is suspended`,
  VENDOR_SCOPE_MISMATCH: (vendorId: number | string, deviceType: string) => `vendor #${vendorId} service scope does not cover device type ${deviceType}`,
  PLAN_NOT_UNSTARTED: (id: number | string) => `plan #${id} has already started or is closed, it keeps the original flow`,
  PLAN_VERSION_CONFLICT: (id: number | string) => `plan #${id} was handled by another dispatcher concurrently, please refresh and retry`,
  BLOCKED_REASON_REQUIRED: "blocked_reason is required when no qualified vendor can take the plan",
  REASSIGN_REASON_REQUIRED: "reason is required when reassigning a plan to another vendor"
} as const;
