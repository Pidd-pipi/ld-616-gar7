export const LOG_TEMPLATES = {
  MeasuringDevice: {
    create: "MeasuringDevice.create",
    update: "MeasuringDevice.update",
    status: "MeasuringDevice.status",
    export: "MeasuringDevice.export",
    detail: "MeasuringDevice.detail",
    calibrationHistory: "MeasuringDevice.calibrationHistory"
  },
  CalibrationPlan: {
    create: "CalibrationPlan.create",
    update: "CalibrationPlan.update",
    status: "CalibrationPlan.status",
    export: "CalibrationPlan.export",
    listPendingSuspension: "CalibrationPlan.listPendingSuspension",
    reassign: "CalibrationPlan.reassign",
    blockUnassigned: "CalibrationPlan.blockUnassigned",
    listChanges: "CalibrationPlan.listChanges"
  },
  CalibrationCertificate: {
    create: "CalibrationCertificate.create",
    update: "CalibrationCertificate.update",
    status: "CalibrationCertificate.status",
    export: "CalibrationCertificate.export"
  },
  CalibrationVendor: {
    create: "CalibrationVendor.create",
    update: "CalibrationVendor.update",
    status: "CalibrationVendor.status",
    export: "CalibrationVendor.export",
    suspend: "CalibrationVendor.suspend",
    eligibleCandidates: "CalibrationVendor.eligibleCandidates"
  },
  OverdueAlert: {
    create: "OverdueAlert.create",
    update: "OverdueAlert.update",
    status: "OverdueAlert.status",
    export: "OverdueAlert.export"
  },
  PlanChangeRecord: {
    create: "PlanChangeRecord.create",
    update: "PlanChangeRecord.update",
    status: "PlanChangeRecord.status",
    export: "PlanChangeRecord.export",
    listByPlan: "PlanChangeRecord.listByPlan",
    listByDevice: "PlanChangeRecord.listByDevice"
  }
} as const;
