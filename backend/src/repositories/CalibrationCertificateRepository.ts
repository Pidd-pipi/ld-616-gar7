import { dataStore, nextId } from "./dataStore";
import type { CalibrationCertificate } from "../models/CalibrationCertificate";

export const calibrationCertificateRepository = {
  findAll: (): CalibrationCertificate[] => dataStore.calibrationCertificate,

  findByDevice: (deviceId: number): CalibrationCertificate[] =>
    dataStore.calibrationCertificate
      .filter((certificate) => certificate.device_id === deviceId)
      .sort((a, b) => b.valid_until.localeCompare(a.valid_until)),

  save: (row: unknown): unknown => {
    const created = row as CalibrationCertificate;
    created.id = nextId(dataStore.calibrationCertificate);
    dataStore.calibrationCertificate.push(created);
    return created;
  }
};
