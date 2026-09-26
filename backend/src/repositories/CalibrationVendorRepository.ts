import { store } from "./store";
import type { CalibrationVendor } from "../models/CalibrationVendor";

export const calibrationVendorRepository = {
  findAll: (): CalibrationVendor[] => store.calibrationVendor,
  findById: (id: number): CalibrationVendor | undefined => store.calibrationVendor.find((row) => row.id === id),
  save: (row: unknown) => row,
  nextId: (): number => store.calibrationVendor.reduce((max, row) => Math.max(max, row.id), 0) + 1
};
