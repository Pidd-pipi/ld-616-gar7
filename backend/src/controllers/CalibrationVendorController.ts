import type { Request, Response } from "express";
import { calibrationVendorService } from "../services/CalibrationVendorService";
import { validateSuspendVendorPayload, parseVendorId } from "../validators/CalibrationVendorValidator";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthUser } from "../types/AuthUser";

const currentUser = (req: Request): AuthUser => (req as unknown as { user: AuthUser }).user;

export const calibrationVendorController = {
  list: asyncHandler((_req: Request, res: Response) => res.json(calibrationVendorService.list())),

  create: asyncHandler((req: Request, res: Response) =>
    res.status(201).json(calibrationVendorService.create(req.body))
  ),

  // 暂停机构资质：未开始计划保留待处置，已开始计划继续走原流程
  suspend: asyncHandler((req: Request, res: Response) => {
    const id = parseVendorId(req.params.id);
    const payload = validateSuspendVendorPayload(req.body);
    res.json(calibrationVendorService.suspend(id, payload, currentUser(req)));
  }),

  // 暂停后处置清单：该机构名下所有未开始计划 + 设备详情 + 可承接机构候选
  triageList: asyncHandler((req: Request, res: Response) =>
    res.json(calibrationVendorService.listUnstartedPlans(parseVendorId(req.params.id)))
  )
};
