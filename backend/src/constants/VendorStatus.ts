export const VendorStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  REVOKED: "REVOKED"
} as const;
export type VendorStatus = (typeof VendorStatus)[keyof typeof VendorStatus];

export const VENDOR_STATUS_LABEL: Record<VendorStatus, string> = {
  ACTIVE: "资质有效",
  SUSPENDED: "资质暂停",
  REVOKED: "资质撤销"
};
