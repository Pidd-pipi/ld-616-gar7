import type { Request, Response } from "express";
import { measuringDeviceService } from "../services/MeasuringDeviceService";
import { asyncHandler } from "../utils/asyncHandler";

export const measuringDeviceController = {
  list: asyncHandler((_req: Request, res: Response) => res.json(measuringDeviceService.list())),
  create: asyncHandler((req: Request, res: Response) =>
    res.status(201).json(measuringDeviceService.create(req.body))
  ),
  // 设备详情可查暂停处置变更流水
  detail: asyncHandler((req: Request, res: Response) =>
    res.json(measuringDeviceService.getDetail(Number(req.params.id)))
  )
};
