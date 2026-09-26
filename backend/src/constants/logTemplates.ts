export const LOG_TEMPLATES = {
  MeasuringDevice: ["MeasuringDevice.create", "MeasuringDevice.update", "MeasuringDevice.status", "MeasuringDevice.export", "MeasuringDevice.detail"],
  CalibrationPlan: ["CalibrationPlan.create", "CalibrationPlan.update", "CalibrationPlan.status", "CalibrationPlan.export", "CalibrationPlan.triageList", "CalibrationPlan.reassign", "CalibrationPlan.releaseBlocked"],
  CalibrationCertificate: ["CalibrationCertificate.create", "CalibrationCertificate.update", "CalibrationCertificate.status", "CalibrationCertificate.export"],
  CalibrationVendor: ["CalibrationVendor.create", "CalibrationVendor.update", "CalibrationVendor.status", "CalibrationVendor.export", "CalibrationVendor.suspend"],
  OverdueAlert: ["OverdueAlert.create", "OverdueAlert.update", "OverdueAlert.status", "OverdueAlert.export"],
  PlanChangeRecord: ["PlanChangeRecord.create", "PlanChangeRecord.update", "PlanChangeRecord.status", "PlanChangeRecord.export"]
};
