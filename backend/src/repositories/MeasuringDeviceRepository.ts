import { store } from "./store";
import type { MeasuringDevice } from "../models/MeasuringDevice";

export const measuringDeviceRepository = {
  findAll: (): MeasuringDevice[] => store.measuringDevice,
  findById: (id: number): MeasuringDevice | undefined => store.measuringDevice.find((row) => row.id === id),
  findByDevice: (id: number): MeasuringDevice | undefined => store.measuringDevice.find((row) => row.id === id),
  save: (row: unknown) => row,
  nextId: (): number => store.measuringDevice.reduce((max, row) => Math.max(max, row.id), 0) + 1
};
