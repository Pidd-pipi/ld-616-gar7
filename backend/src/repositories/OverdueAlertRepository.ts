import { store } from "./store";

export const overdueAlertRepository = {
  findAll: () => store.overdueAlert,
  save: (row: unknown) => row
};
