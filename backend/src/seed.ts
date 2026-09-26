export const seed = {
  "measuringDevice": [
    {
      "id": 1,
      "device_code": "DEV-DIM-001",
      "name": "游标卡尺",
      "device_type": "DIMENSIONAL",
      "accuracy_level": "MEDIUM",
      "owner_dept": "机加工车间",
      "calibration_cycle_days": 365,
      "status": "DUE_SOON"
    },
    {
      "id": 2,
      "device_code": "DEV-TMP-001",
      "name": "铂电阻温度计",
      "device_type": "TEMPERATURE",
      "accuracy_level": "HIGH",
      "owner_dept": "环境试验室",
      "calibration_cycle_days": 180,
      "status": "VALID"
    },
    {
      "id": 3,
      "device_code": "DEV-PRS-001",
      "name": "精密压力表",
      "device_type": "PRESSURE",
      "accuracy_level": "HIGH",
      "owner_dept": "动力车间",
      "calibration_cycle_days": 180,
      "status": "DUE_SOON"
    },
    {
      "id": 4,
      "device_code": "DEV-ELE-001",
      "name": "数字万用表",
      "device_type": "ELECTRICAL",
      "accuracy_level": "MEDIUM",
      "owner_dept": "电气试验室",
      "calibration_cycle_days": 365,
      "status": "CALIBRATING"
    },
    {
      "id": 5,
      "device_code": "DEV-DIM-002",
      "name": "千分表",
      "device_type": "DIMENSIONAL",
      "accuracy_level": "LOW",
      "owner_dept": "质检部",
      "calibration_cycle_days": 365,
      "status": "OVERDUE"
    },
    {
      "id": 6,
      "device_code": "DEV-WGT-001",
      "name": "标准砝码组",
      "device_type": "MASS",
      "accuracy_level": "HIGH",
      "owner_dept": "衡器室",
      "calibration_cycle_days": 730,
      "status": "VALID"
    }
  ],
  "calibrationPlan": [
    {
      "id": 1,
      "device_id": 1,
      "planned_date": "2026-10-11T09:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "NORMAL",
      "status": "ASSIGNED",
      "assigned_vendor_id": 1,
      "created_by": "planner-zhang",
      "original_vendor_id": null,
      "handled_by": null,
      "handled_reason": null,
      "blocked_reason": null,
      "handled_at": null,
      "version": 0
    },
    {
      "id": 2,
      "device_id": 2,
      "planned_date": "2026-10-12T09:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "NORMAL",
      "status": "ASSIGNED",
      "assigned_vendor_id": 2,
      "created_by": "planner-zhang",
      "original_vendor_id": null,
      "handled_by": null,
      "handled_reason": null,
      "blocked_reason": null,
      "handled_at": null,
      "version": 0
    },
    {
      "id": 3,
      "device_id": 3,
      "planned_date": "2026-10-13T09:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "HIGH",
      "status": "ASSIGNED",
      "assigned_vendor_id": 2,
      "created_by": "planner-li",
      "original_vendor_id": null,
      "handled_by": null,
      "handled_reason": null,
      "blocked_reason": null,
      "handled_at": null,
      "version": 0
    },
    {
      "id": 4,
      "device_id": 4,
      "planned_date": "2026-09-20T09:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "NORMAL",
      "status": "IN_PROGRESS",
      "assigned_vendor_id": 2,
      "created_by": "planner-li",
      "original_vendor_id": null,
      "handled_by": null,
      "handled_reason": null,
      "blocked_reason": null,
      "handled_at": null,
      "version": 0
    },
    {
      "id": 5,
      "device_id": 5,
      "planned_date": "2026-10-15T09:00:00Z",
      "plan_type": "OVERDUE_RERUN",
      "priority": "HIGH",
      "status": "ASSIGNED",
      "assigned_vendor_id": 1,
      "created_by": "planner-zhang",
      "original_vendor_id": null,
      "handled_by": null,
      "handled_reason": null,
      "blocked_reason": null,
      "handled_at": null,
      "version": 0
    },
    {
      "id": 6,
      "device_id": 6,
      "planned_date": "2026-11-01T09:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "NORMAL",
      "status": "PLANNED",
      "assigned_vendor_id": null,
      "created_by": "planner-li",
      "original_vendor_id": null,
      "handled_by": null,
      "handled_reason": null,
      "blocked_reason": null,
      "handled_at": null,
      "version": 0
    },
    {
      "id": 7,
      "device_id": 1,
      "planned_date": "2025-10-11T09:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "NORMAL",
      "status": "CLOSED",
      "assigned_vendor_id": 1,
      "created_by": "planner-zhang",
      "original_vendor_id": null,
      "handled_by": null,
      "handled_reason": null,
      "blocked_reason": null,
      "handled_at": null,
      "version": 0
    }
  ],
  "calibrationCertificate": [
    {
      "id": 1,
      "device_id": 1,
      "plan_id": 7,
      "certificate_no": "CERT-2025-0001",
      "result_status": "PASS",
      "valid_until": "2026-10-11",
      "file_path": "/certs/CERT-2025-0001.pdf",
      "issued_by": "华东计量院"
    },
    {
      "id": 2,
      "device_id": 4,
      "plan_id": 4,
      "certificate_no": "CERT-2026-0004",
      "result_status": "LIMITED_PASS",
      "valid_until": "2027-09-20",
      "file_path": "/certs/CERT-2026-0004.pdf",
      "issued_by": "中诚校准"
    }
  ],
  "calibrationVendor": [
    {
      "id": 1,
      "vendor_name": "华东计量科学研究院",
      "qualification_no": "CNAS-L0001",
      "contact_phone": "13800000001",
      "service_scope": "DIMENSIONAL,MASS",
      "vendor_status": "ACTIVE"
    },
    {
      "id": 2,
      "vendor_name": "中诚校准实验室",
      "qualification_no": "CNAS-L0002",
      "contact_phone": "13800000002",
      "service_scope": "TEMPERATURE,PRESSURE,ELECTRICAL",
      "vendor_status": "ACTIVE"
    },
    {
      "id": 3,
      "vendor_name": "恒信计量检测有限公司",
      "qualification_no": "CNAS-L0003",
      "contact_phone": "13800000003",
      "service_scope": "DIMENSIONAL",
      "vendor_status": "ACTIVE"
    },
    {
      "id": 4,
      "vendor_name": "广谱计量技术服务中心",
      "qualification_no": "CNAS-L0004",
      "contact_phone": "13800000004",
      "service_scope": "ELECTRICAL,TEMPERATURE",
      "vendor_status": "ACTIVE"
    },
    {
      "id": 5,
      "vendor_name": "华测热工校准站",
      "qualification_no": "CNAS-L0005",
      "contact_phone": "13800000005",
      "service_scope": "TEMPERATURE",
      "vendor_status": "ACTIVE"
    }
  ],
  "overdueAlert": [
    {
      "id": 1,
      "device_id": 5,
      "plan_id": 5,
      "alert_level": "HIGH",
      "alert_reason": "千分表已超出校准有效期 12 天",
      "handled_by": "alert-watcher",
      "handled_at": "2026-09-25T02:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 2,
      "device_id": 1,
      "plan_id": 1,
      "alert_level": "LOW",
      "alert_reason": "游标卡尺 15 天后到期",
      "handled_by": "alert-watcher",
      "handled_at": "2026-09-25T02:00:00Z",
      "status": "HANDLED"
    }
  ]
} as const;
