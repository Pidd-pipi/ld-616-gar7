export const seed = {
  "measuringDevice": [
    {
      "id": 1,
      "device_code": "DEV-TEMP-001",
      "name": "恒温箱温度记录仪",
      "device_type": "THERMAL",
      "accuracy_level": "HIGH",
      "owner_dept": "理化实验室",
      "calibration_cycle_days": 365,
      "status": "DUE_SOON"
    },
    {
      "id": 2,
      "device_code": "DEV-PRES-002",
      "name": "精密数字压力表",
      "device_type": "PRESSURE",
      "accuracy_level": "MEDIUM",
      "owner_dept": "机加车间",
      "calibration_cycle_days": 180,
      "status": "VALID"
    },
    {
      "id": 3,
      "device_code": "DEV-DIM-003",
      "name": "三坐标测量机",
      "device_type": "DIMENSION",
      "accuracy_level": "HIGH",
      "owner_dept": "质检中心",
      "calibration_cycle_days": 365,
      "status": "OVERDUE"
    },
    {
      "id": 4,
      "device_code": "DEV-ELEC-004",
      "name": "数字万用表",
      "device_type": "ELECTRICAL",
      "accuracy_level": "LOW",
      "owner_dept": "电气车间",
      "calibration_cycle_days": 365,
      "status": "CALIBRATING"
    },
    {
      "id": 5,
      "device_code": "DEV-GAS-005",
      "name": "可燃气体检测仪",
      "device_type": "GAS",
      "accuracy_level": "MEDIUM",
      "owner_dept": "安环部",
      "calibration_cycle_days": 180,
      "status": "DUE_SOON"
    }
  ],
  "calibrationPlan": [
    {
      "id": 1,
      "device_id": 1,
      "planned_date": "2026-10-15T02:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "HIGH",
      "status": "ASSIGNED",
      "assigned_vendor_id": 6,
      "original_vendor_id": null,
      "last_suspension_handling": null,
      "suspension_handled_by": null,
      "suspension_reason": null,
      "block_reason": null,
      "version": 1,
      "created_by": "planner.li"
    },
    {
      "id": 2,
      "device_id": 2,
      "planned_date": "2026-10-18T02:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "MEDIUM",
      "status": "ASSIGNED",
      "assigned_vendor_id": 6,
      "original_vendor_id": null,
      "last_suspension_handling": null,
      "suspension_handled_by": null,
      "suspension_reason": null,
      "block_reason": null,
      "version": 1,
      "created_by": "planner.li"
    },
    {
      "id": 3,
      "device_id": 3,
      "planned_date": "2026-10-20T02:00:00Z",
      "plan_type": "OVERDUE",
      "priority": "HIGH",
      "status": "ASSIGNED",
      "assigned_vendor_id": 6,
      "original_vendor_id": null,
      "last_suspension_handling": null,
      "suspension_handled_by": null,
      "suspension_reason": null,
      "block_reason": null,
      "version": 1,
      "created_by": "planner.wang"
    },
    {
      "id": 4,
      "device_id": 4,
      "planned_date": "2026-09-24T02:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "MEDIUM",
      "status": "IN_PROGRESS",
      "assigned_vendor_id": 6,
      "original_vendor_id": null,
      "last_suspension_handling": null,
      "suspension_handled_by": null,
      "suspension_reason": null,
      "block_reason": null,
      "version": 1,
      "created_by": "planner.wang"
    },
    {
      "id": 5,
      "device_id": 5,
      "planned_date": "2026-11-02T02:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "LOW",
      "status": "ASSIGNED",
      "assigned_vendor_id": 6,
      "original_vendor_id": null,
      "last_suspension_handling": null,
      "suspension_handled_by": null,
      "suspension_reason": null,
      "block_reason": null,
      "version": 1,
      "created_by": "planner.li"
    },
    {
      "id": 6,
      "device_id": 1,
      "planned_date": "2025-10-15T02:00:00Z",
      "plan_type": "PERIODIC",
      "priority": "MEDIUM",
      "status": "CLOSED",
      "assigned_vendor_id": 1,
      "original_vendor_id": null,
      "last_suspension_handling": null,
      "suspension_handled_by": null,
      "suspension_reason": null,
      "block_reason": null,
      "version": 1,
      "created_by": "planner.li"
    }
  ],
  "calibrationCertificate": [
    {
      "id": 1,
      "device_id": 1,
      "plan_id": 6,
      "certificate_no": "CERT-2025-10-0001",
      "result_status": "PASS",
      "valid_until": "2026-10-15",
      "file_path": "/certificates/CERT-2025-10-0001.pdf",
      "issued_by": "华测计量院"
    },
    {
      "id": 2,
      "device_id": 2,
      "plan_id": 2,
      "certificate_no": "",
      "result_status": "PASS",
      "valid_until": "2027-04-18",
      "file_path": "",
      "issued_by": ""
    }
  ],
  "calibrationVendor": [
    {
      "id": 1,
      "vendor_name": "华测计量科学研究院",
      "qualification_no": "CNAS-L0001",
      "contact_phone": "010-88000001",
      "service_scope": "THERMAL,PRESSURE,DIMENSION",
      "vendor_status": "ACTIVE",
      "suspend_reason": null,
      "suspended_at": null,
      "suspended_by": null
    },
    {
      "id": 2,
      "vendor_name": "中检计量技术有限公司",
      "qualification_no": "CNAS-L0002",
      "contact_phone": "021-88000002",
      "service_scope": "THERMAL,ELECTRICAL",
      "vendor_status": "ACTIVE",
      "suspend_reason": null,
      "suspended_at": null,
      "suspended_by": null
    },
    {
      "id": 3,
      "vendor_name": "华南精密校准中心",
      "qualification_no": "CNAS-L0003",
      "contact_phone": "020-88000003",
      "service_scope": "DIMENSION,PRESSURE",
      "vendor_status": "ACTIVE",
      "suspend_reason": null,
      "suspended_at": null,
      "suspended_by": null
    },
    {
      "id": 4,
      "vendor_name": "安规电气检测所",
      "qualification_no": "CNAS-L0004",
      "contact_phone": "0755-88000004",
      "service_scope": "ELECTRICAL,GAS",
      "vendor_status": "REVOKED",
      "suspend_reason": "资质撤销（历史数据）",
      "suspended_at": null,
      "suspended_by": null
    },
    {
      "id": 5,
      "vendor_name": "西部综合计量站",
      "qualification_no": "CNAS-L0005",
      "contact_phone": "028-88000005",
      "service_scope": "PRESSURE",
      "vendor_status": "ACTIVE",
      "suspend_reason": null,
      "suspended_at": null,
      "suspended_by": null
    },
    {
      "id": 6,
      "vendor_name": "东方全项校准服务公司",
      "qualification_no": "CNAS-L0006",
      "contact_phone": "0571-88000006",
      "service_scope": "THERMAL,PRESSURE,DIMENSION,ELECTRICAL,GAS",
      "vendor_status": "SUSPENDED",
      "suspend_reason": "CNAS 飞行检查不符合项，暂停全部校准资质 3 个月",
      "suspended_at": "2026-09-25T03:30:00Z",
      "suspended_by": "quality.chen"
    }
  ],
  "overdueAlert": [
    {
      "id": 1,
      "device_id": 3,
      "plan_id": 3,
      "alert_level": "HIGH",
      "alert_reason": "校准计划已超期，证书失效",
      "handled_by": "",
      "handled_at": "",
      "status": "OPEN"
    }
  ],
  "planChangeRecord": []
} as const;
