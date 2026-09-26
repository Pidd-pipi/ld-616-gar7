CREATE TABLE IF NOT EXISTS measuring_device (
  id INTEGER PRIMARY KEY,
  device_code TEXT,
  name TEXT,
  device_type TEXT,
  accuracy_level TEXT,
  owner_dept TEXT,
  calibration_cycle_days INTEGER,
  status TEXT
);

CREATE TABLE IF NOT EXISTS calibration_plan (
  id INTEGER PRIMARY KEY,
  device_id INTEGER,
  planned_date TEXT,
  plan_type TEXT,
  priority TEXT,
  status TEXT,
  assigned_vendor_id INTEGER,
  -- 暂停处置：原机构、处置人、原因保留在计划上，设备与日期不变
  original_vendor_id INTEGER,
  last_suspension_handling TEXT,
  suspension_handled_by TEXT,
  suspension_reason TEXT,
  block_reason TEXT,
  -- 乐观锁版本：两名调度员同时处理同一笔时只允许一次落地
  version INTEGER NOT NULL DEFAULT 1,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS calibration_certificate (
  id INTEGER PRIMARY KEY,
  device_id INTEGER,
  plan_id INTEGER,
  certificate_no TEXT,
  result_status TEXT,
  valid_until TEXT,
  file_path TEXT,
  issued_by TEXT
);

CREATE TABLE IF NOT EXISTS calibration_vendor (
  id INTEGER PRIMARY KEY,
  vendor_name TEXT,
  qualification_no TEXT,
  contact_phone TEXT,
  service_scope TEXT,
  vendor_status TEXT,
  -- 资质暂停留痕
  suspend_reason TEXT,
  suspended_at TEXT,
  suspended_by TEXT
);

CREATE TABLE IF NOT EXISTS overdue_alert (
  id INTEGER PRIMARY KEY,
  device_id INTEGER,
  plan_id INTEGER,
  alert_level TEXT,
  alert_reason TEXT,
  handled_by TEXT,
  handled_at TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS plan_change_record (
  id INTEGER PRIMARY KEY,
  plan_id INTEGER,
  device_id INTEGER,
  -- VENDOR_SUSPENDED / REASSIGNED / BLOCKED_UNASSIGNED
  change_type TEXT,
  previous_vendor_id INTEGER,
  new_vendor_id INTEGER,
  previous_status TEXT,
  new_status TEXT,
  reason TEXT,
  handled_by TEXT,
  handled_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);
