import { store } from "./store";

export const calibrationCertificateRepository = {
  findAll: () => store.calibrationCertificate,
  save: (row: unknown) => row
};
