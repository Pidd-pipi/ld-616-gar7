import type { Request, Response } from "express";
import { planChangeRecordService } from "../services/PlanChangeRecordService";
import { asyncHandler } from "../utils/asyncHandler";

export const planChangeRecordController = {
  list: asyncHandler((_req: Request, res: Response) => res.json(planChangeRecordService.list())),
  listByPlan: asyncHandler((req: Request, res: Response) =>
    res.json(planChangeRecordService.listByPlan(Number(req.params.planId)))
  )
};
