export type CalibrationVendorPayload = Record<string, unknown>;

// 暂停机构资质：已派发的未开始计划不自动取消，转由调度员逐笔处置
export interface SuspendVendorPayload {
  reason?: string;
  handled_by?: string;
  handled_by_name?: string;
}
