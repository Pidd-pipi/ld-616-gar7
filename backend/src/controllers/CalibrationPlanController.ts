import type { Request, Response } from "express";
import { calibrationPlanService } from "../services/CalibrationPlanService";
import { planChangeRecordService } from "../services/PlanChangeRecordService";
import { sendServiceError } from "../utils/httpStatus";
import { ServiceError, ERROR_CODES } from "../utils/ServiceError";
import { writeOperationLog } from "../utils/operationLogger";
import type { AuthUser } from "../middlewares/authMiddleware";

const actorOf = (req: Request) =>
  (req as unknown as { user: AuthUser }).user ?? { id: 0, username: "anonymous", role: "admin" };

export const calibrationPlanController = {
  list: (_req: Request, res: Response) =>
    res.json(calibrationPlanService.list()),

  create: (req: Request, res: Response) =>
    res.status(201).json(calibrationPlanService.create(req.body)),

  // GET /api/calibration-plan/suspension-pending?vendor_id=6
  listPendingSuspension: (req: Request, res: Response) => {
    try {
      const vendorId = Number(req.query.vendor_id);
      if (!Number.isInteger(vendorId) || vendorId <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_FAILED, 422, {
          field: "vendor_id"
        });
      }
      const items = calibrationPlanService.listPendingSuspension(vendorId);
      writeOperationLog("CalibrationPlan", "listPendingSuspension", actorOf(req), vendorId, {
        count: items.length
      });
      res.json({ vendor_id: vendorId, total: items.length, items });
    } catch (error) {
      sendServiceError(res, error);
    }
  },

  // GET /api/calibration-plan/:id/changes
  listChanges: (req: Request, res: Response) => {
    try {
      const planId = Number(req.params.id);
      const records = planChangeRecordService.listByPlan(planId);
      writeOperationLog("CalibrationPlan", "listChanges", actorOf(req), planId, {
        count: records.length
      });
      res.json({ plan_id: planId, total: records.length, items: records });
    } catch (error) {
      sendServiceError(res, error);
    }
  },

  // POST /api/calibration-plan/:id/reassign
  reassign: async (req: Request, res: Response) => {
    try {
      const planId = Number(req.params.id);
      const result = await calibrationPlanService.reassign(planId, req.body ?? {}, actorOf(req));
      res.status(200).json({ code: "REASSIGNED", ...result });
    } catch (error) {
      sendServiceError(res, error);
    }
  },

  // POST /api/calibration-plan/:id/block-unassigned
  blockUnassigned: async (req: Request, res: Response) => {
    try {
      const planId = Number(req.params.id);
      const result = await calibrationPlanService.blockUnassigned(
        planId,
        req.body ?? {},
        actorOf(req)
      );
      res.status(200).json({ code: "BLOCKED_UNASSIGNED", ...result });
    } catch (error) {
      sendServiceError(res, error);
    }
  }
};
