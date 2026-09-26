import type { Request, Response } from "express";
import { measuringDeviceService } from "../services/MeasuringDeviceService";
import { sendServiceError } from "../utils/httpStatus";
import { writeOperationLog } from "../utils/operationLogger";
import type { AuthUser } from "../middlewares/authMiddleware";

const actorOf = (req: Request) =>
  (req as unknown as { user: AuthUser }).user ?? { id: 0, username: "anonymous", role: "admin" };

export const measuringDeviceController = {
  list: (_req: Request, res: Response) =>
    res.json(measuringDeviceService.list()),

  create: (req: Request, res: Response) =>
    res.status(201).json(measuringDeviceService.create(req.body)),

  // GET /api/measuring-device/:id
  detail: (req: Request, res: Response) => {
    try {
      const deviceId = Number(req.params.id);
      const device = measuringDeviceService.detail(deviceId);
      writeOperationLog("MeasuringDevice", "detail", actorOf(req), deviceId, {});
      res.json(device);
    } catch (error) {
      sendServiceError(res, error);
    }
  },

  // GET /api/measuring-device/:id/calibration-history
  calibrationHistory: (req: Request, res: Response) => {
    try {
      const deviceId = Number(req.params.id);
      const history = measuringDeviceService.calibrationHistory(deviceId);
      writeOperationLog("MeasuringDevice", "calibrationHistory", actorOf(req), deviceId, {
        plan_count: history.plans.length,
        certificate_count: history.certificates.length,
        change_count: history.change_records.length
      });
      res.json(history);
    } catch (error) {
      sendServiceError(res, error);
    }
  }
};
