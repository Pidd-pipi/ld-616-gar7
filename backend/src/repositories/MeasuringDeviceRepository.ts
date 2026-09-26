import { dataStore, nextId } from "./dataStore";
import type { MeasuringDevice } from "../models/MeasuringDevice";

export const measuringDeviceRepository = {
  findAll: (): MeasuringDevice[] => dataStore.measuringDevice,

  findById: (id: number): MeasuringDevice | undefined =>
    dataStore.measuringDevice.find((device) => device.id === id),

  save: (row: unknown): unknown => {
    const created = row as MeasuringDevice;
    created.id = nextId(dataStore.measuringDevice);
    dataStore.measuringDevice.push(created);
    return created;
  }
};
