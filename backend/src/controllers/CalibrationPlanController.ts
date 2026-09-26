import type { Request, Response } from "express";
import { calibrationPlanService } from "../services/CalibrationPlanService";
import {
  validateReassignPlanPayload,
  validateReleaseBlockedPlanPayload,
  parsePlanId
} from "../validators/CalibrationPlanValidator";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthUser } from "../types/AuthUser";

const currentUser = (req: Request): AuthUser => (req as unknown as { user: AuthUser }).user;

export const calibrationPlanController = {
  list: asyncHandler((_req: Request, res: Response) => res.json(calibrationPlanService.list())),

  create: asyncHandler((req: Request, res: Response) =>
    res.status(201).json(calibrationPlanService.create(req.body))
  ),

  detail: asyncHandler((req: Request, res: Response) =>
    res.json(calibrationPlanService.getById(parsePlanId(req.params.id)))
  ),

  // 调度员把一笔暂停机构名下的未开始计划改派给资质有效、范围匹配的机构
  reassign: asyncHandler((req: Request, res: Response) => {
    const id = parsePlanId(req.params.id);
    const payload = validateReassignPlanPayload(req.body);
    res.json(calibrationPlanService.reassign(id, payload, currentUser(req)));
  }),

  // 无人接单：退回未派发并写明阻塞原因
  releaseBlocked: asyncHandler((req: Request, res: Response) => {
    const id = parsePlanId(req.params.id);
    const payload = validateReleaseBlockedPlanPayload(req.body);
    res.json(calibrationPlanService.releaseBlocked(id, payload, currentUser(req)));
  })
};
