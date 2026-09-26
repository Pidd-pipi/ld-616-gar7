import type { Request, Response } from "express";
import { calibrationVendorService } from "../services/CalibrationVendorService";
import { sendServiceError } from "../utils/httpStatus";
import { ServiceError, ERROR_CODES } from "../utils/ServiceError";
import { writeOperationLog } from "../utils/operationLogger";
import type { AuthUser } from "../middlewares/authMiddleware";

const actorOf = (req: Request) =>
  (req as unknown as { user: AuthUser }).user ?? { id: 0, username: "anonymous", role: "admin" };

export const calibrationVendorController = {
  list: (_req: Request, res: Response) =>
    res.json(calibrationVendorService.list()),

  create: (req: Request, res: Response) =>
    res.status(201).json(calibrationVendorService.create(req.body)),

  // GET /api/calibration-vendor/eligible?device_type=THERMAL&exclude_vendor_id=6
  listEligibleCandidates: (req: Request, res: Response) => {
    try {
      const deviceType = String(req.query.device_type ?? "").trim();
      if (!deviceType) {
        throw new ServiceError(ERROR_CODES.VALIDATION_FAILED, 422, {
          field: "device_type"
        });
      }
      const excludeRaw = req.query.exclude_vendor_id;
      const excludeVendorId =
        excludeRaw === undefined ? undefined : Number(excludeRaw);
      const vendors = calibrationVendorService.listEligibleCandidates(
        deviceType,
        excludeVendorId
      );
      writeOperationLog("CalibrationVendor", "eligibleCandidates", actorOf(req), deviceType, {
        count: vendors.length
      });
      res.json({ device_type: deviceType, total: vendors.length, items: vendors });
    } catch (error) {
      sendServiceError(res, error);
    }
  },

  // POST /api/calibration-vendor/:id/suspend
  suspend: async (req: Request, res: Response) => {
    try {
      const vendorId = Number(req.params.id);
      const result = await Promise.resolve(
        calibrationVendorService.suspend(vendorId, req.body ?? {}, actorOf(req))
      );
      res.status(200).json({ code: "VENDOR_SUSPENDED", ...result });
    } catch (error) {
      sendServiceError(res, error);
    }
  }
};
