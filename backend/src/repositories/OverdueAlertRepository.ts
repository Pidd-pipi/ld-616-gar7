import { dataStore, nextId } from "./dataStore";
import type { OverdueAlert } from "../models/OverdueAlert";

export const overdueAlertRepository = {
  findAll: (): OverdueAlert[] => dataStore.overdueAlert,

  save: (row: unknown): unknown => {
    const created = row as OverdueAlert;
    created.id = nextId(dataStore.overdueAlert);
    dataStore.overdueAlert.push(created);
    return created;
  }
};
