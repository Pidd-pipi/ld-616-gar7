import { Router } from "express";
import { measuringDeviceController } from "../controllers/MeasuringDeviceController";

const router = Router();

router.get("/", measuringDeviceController.list);
router.post("/", measuringDeviceController.create);
// 设备详情：含校准计划与暂停处置变更
router.get("/:id/detail", measuringDeviceController.detail);

export default router;
