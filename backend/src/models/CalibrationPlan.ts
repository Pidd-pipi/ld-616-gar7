export interface CalibrationPlan {
  id: number;
  device_id: number;
  planned_date: string;
  plan_type: string;
  priority: string;
  status: string;
  assigned_vendor_id: number | null;
  created_by: string;
  // 暂停处置：被暂停的原承接机构；改派后保留，退回未派发也保留
  original_vendor_id: number | null;
  // 暂停处置：最近一次处理人（调度员）
  handled_by: string | null;
  // 暂停处置：改派原因 / 退回阻塞原因
  handled_reason: string | null;
  // 暂停处置：无人接单时写明的阻塞原因
  blocked_reason: string | null;
  handled_at: string | null;
  // 乐观锁：两个调度员同时处理同一计划时只能落地一次
  version: number;
}
