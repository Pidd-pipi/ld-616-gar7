export const VendorStatus = ["ACTIVE", "SUSPENDED"] as const;
export type VendorStatus = (typeof VendorStatus)[number];
